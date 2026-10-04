import { Client } from 'pg';
import { getTableColumns, getTableName, is, Table } from 'drizzle-orm';
import type { PgColumn } from 'drizzle-orm/pg-core';
import { loadDatabaseEnv } from '../config/env';
import { AppError } from '../lib/errors';
import { logger } from '../lib/logger';
import * as schema from './schema';
import { redactTarget } from './migrate';

const MIGRATIONS_TABLE = '__drizzle_migrations';

type ColumnExpectation = {
  table: string;
  column: string;
  expectedType: string;
  notNull: boolean;
  hasDefault: boolean;
};

type LiveColumn = {
  table_name: string;
  column_name: string;
  udt_name: string;
  is_nullable: 'YES' | 'NO';
  column_default: string | null;
};

type LiveEnum = {
  type_name: string;
  values: string[];
};

const UDT_TO_SQL_TYPE: Record<string, string> = {
  int2: 'smallint',
  int4: 'integer',
  int8: 'bigint',
  bool: 'boolean',
  float4: 'real',
  float8: 'double precision',
  numeric: 'numeric',
  varchar: 'text',
  text: 'text',
  date: 'date',
  time: 'time without time zone',
  timetz: 'time with time zone',
  timestamp: 'timestamp without time zone',
  timestamptz: 'timestamp with time zone',
  uuid: 'uuid',
  json: 'json',
  jsonb: 'jsonb',
};

function baseType(sqlType: string): string {
  return sqlType.replace(/\(.*\)$/, '').replace(/\s+/g, ' ').trim().toLowerCase();
}

// information_schema reports an array column with an underscore-prefixed udt_name
// (_text for text[]), so the array marker has to be restored before comparing.
function liveBaseType(udtName: string): string {
  const lowered = udtName.toLowerCase();

  if (lowered.startsWith('_')) {
    const element = UDT_TO_SQL_TYPE[lowered.slice(1)] ?? lowered.slice(1);
    return `${element}[]`;
  }

  return UDT_TO_SQL_TYPE[lowered] ?? lowered;
}

function isEnumDefinition(value: unknown): value is { enumValues: string[] } {
  return (
    typeof value === 'object' &&
    value !== null &&
    Array.isArray((value as { enumValues?: unknown }).enumValues)
  );
}

function collectEnumDefinitions(): Map<string, string[]> {
  const enums = new Map<string, string[]>();

  for (const value of Object.values(schema)) {
    if (isEnumDefinition(value)) {
      enums.set(value.enumValues.join(','), value.enumValues);
    }
  }

  return enums;
}

function collectColumnExpectations(): ColumnExpectation[] {
  const expectations: ColumnExpectation[] = [];

  for (const value of Object.values(schema)) {
    if (!is(value, Table)) {
      continue;
    }

    const table = getTableName(value);
    const columns = getTableColumns(value);

    for (const [key, column] of Object.entries(columns)) {
      const pgColumn = column as PgColumn;
      expectations.push({
        table,
        column: pgColumn.name ?? key,
        expectedType: baseType(pgColumn.getSQLType()),
        notNull: pgColumn.notNull === true,
        hasDefault: pgColumn.hasDefault === true,
      });
    }
  }

  return expectations;
}

function collectTableNames(): string[] {
  return Object.values(schema)
    .filter((value) => is(value, Table))
    .map((value) => getTableName(value));
}

async function readLiveSchema(client: Client) {
  const tables = await client.query<{ table_name: string }>(
    `SELECT table_name FROM information_schema.tables
     WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
     ORDER BY table_name`,
  );

  const columns = await client.query<LiveColumn>(
    `SELECT table_name, column_name, udt_name, is_nullable, column_default
     FROM information_schema.columns
     WHERE table_schema = 'public'
     ORDER BY table_name, ordinal_position`,
  );

  const enums = await client.query<{ typname: string; labels: string[] }>(
    `SELECT t.typname, array_agg(e.enumlabel ORDER BY e.enumsortorder) AS labels
     FROM pg_type t
     JOIN pg_enum e ON e.enumtypid = t.oid
     JOIN pg_namespace n ON n.oid = t.typnamespace
     WHERE n.nspname = 'public'
     GROUP BY t.typname
     ORDER BY t.typname`,
  );

  const indexes = await client.query<{ indexname: string; indexdef: string }>(
    `SELECT indexname, indexdef FROM pg_indexes WHERE schemaname = 'public'`,
  );

  const liveEnums = new Map<string, string[]>(
    enums.rows.map((row) => [row.typname.toLowerCase(), row.labels]),
  );

  return {
    tableNames: tables.rows.map((row) => row.table_name),
    columns: columns.rows,
    liveEnums,
    indexDefinitions: indexes.rows,
  };
}

function checkTableInventory(
  expectedTables: string[],
  liveTables: string[],
  drift: string[],
): void {
  const expected = new Set(expectedTables);
  const live = new Set(liveTables.filter((name) => name !== MIGRATIONS_TABLE));

  for (const missing of [...expected].filter((name) => !live.has(name)).sort()) {
    drift.push(`table missing in database: ${missing}`);
  }

  for (const extra of [...live].filter((name) => !expected.has(name)).sort()) {
    drift.push(`table present in database but absent from schema.ts: ${extra}`);
  }
}

function checkColumns(
  expectations: ColumnExpectation[],
  liveColumns: LiveColumn[],
  liveEnums: Map<string, string[]>,
  drift: string[],
): void {
  const liveByTable = new Map<string, Map<string, LiveColumn>>();

  for (const row of liveColumns) {
    if (row.column_name === undefined) {
      continue;
    }
    const existing = liveByTable.get(row.table_name);
    if (existing) {
      existing.set(row.column_name, row);
    } else {
      liveByTable.set(row.table_name, new Map([[row.column_name, row]]));
    }
  }

  for (const expectation of expectations) {
    const tableColumns = liveByTable.get(expectation.table);

    if (!tableColumns) {
      continue;
    }

    const live = tableColumns.get(expectation.column);

    if (!live) {
      drift.push(`column missing: ${expectation.table}.${expectation.column}`);
      continue;
    }

    const liveBase = liveBaseType(live.udt_name);

    if (liveBase !== expectation.expectedType) {
      drift.push(
        `type mismatch: ${expectation.table}.${expectation.column} expected ${expectation.expectedType}, database has ${liveBase}`,
      );
    }

    const liveNotNull = live.is_nullable === 'NO';

    if (liveNotNull !== expectation.notNull) {
      drift.push(
        `nullability mismatch: ${expectation.table}.${expectation.column} expected ${expectation.notNull ? 'NOT NULL' : 'NULLABLE'}, database has ${liveNotNull ? 'NOT NULL' : 'NULLABLE'}`,
      );
    }

    if (expectation.hasDefault && live.column_default === null) {
      drift.push(`missing default: ${expectation.table}.${expectation.column}`);
    }
  }

  const expectedByTable = new Map<string, Set<string>>();

  for (const expectation of expectations) {
    const existing = expectedByTable.get(expectation.table);
    if (existing) {
      existing.add(expectation.column);
    } else {
      expectedByTable.set(expectation.table, new Set([expectation.column]));
    }
  }

  for (const [tableName, tableColumns] of liveByTable) {
    const expected = expectedByTable.get(tableName);

    if (!expected) {
      continue;
    }

    for (const columnName of [...tableColumns.keys()].sort()) {
      if (!expected.has(columnName)) {
        drift.push(`column present in database but absent from schema.ts: ${tableName}.${columnName}`);
      }
    }
  }

  if (liveEnums.size === 0) {
    drift.push('no enum types found in the public schema');
  }
}

function checkEnumValues(
  enumDefinitions: Map<string, string[]>,
  liveEnums: Map<string, string[]>,
  drift: string[],
): void {
  for (const [signature, values] of enumDefinitions) {
    const typeName = [...liveEnums.keys()].find((name) => {
      const live = liveEnums.get(name);
      return live ? live.join(',') === signature : false;
    });

    if (!typeName) {
      const known = [...liveEnums.values()].some((live) => live.join(',') === signature);
      drift.push(
        known
          ? `enum with values [${signature}] exists but no column in schema.ts uses it`
          : `enum [${signature}] is declared in schema.ts but missing in the database`,
      );
      continue;
    }

    const liveValues = liveEnums.get(typeName) ?? [];
    if (liveValues.join(',') !== values.join(',')) {
      drift.push(`enum values differ for ${typeName}: expected [${values}], database has [${liveValues}]`);
    }
  }
}

export type VerifyReport = {
  target: { host: string; database: string };
  expectedTables: number;
  liveTables: number;
  expectedColumns: number;
  drift: string[];
};

export async function verifySchema(): Promise<VerifyReport> {
  const env = loadDatabaseEnv();
  const expectations = collectColumnExpectations();
  const tableNames = collectTableNames();
  const enumDefinitions = collectEnumDefinitions();

  const client = new Client({ connectionString: env.databaseUrl });

  try {
    await client.connect();
    const live = await readLiveSchema(client);
    const drift: string[] = [];

    checkTableInventory(tableNames, live.tableNames, drift);
    checkColumns(expectations, live.columns, live.liveEnums, drift);
    checkEnumValues(enumDefinitions, live.liveEnums, drift);

    return {
      target: redactTarget(env.databaseUrl),
      expectedTables: tableNames.length,
      liveTables: live.tableNames.filter((name) => name !== MIGRATIONS_TABLE).length,
      expectedColumns: expectations.length,
      drift,
    };
  } finally {
    await client.end().catch(() => undefined);
  }
}

async function main(): Promise<void> {
  const report = await verifySchema();

  logger.info(
    {
      target: report.target,
      expectedTables: report.expectedTables,
      liveTables: report.liveTables,
      expectedColumns: report.expectedColumns,
      driftCount: report.drift.length,
    },
    'db:verify: drift scan complete',
  );

  if (report.drift.length > 0) {
    for (const finding of report.drift) {
      logger.error({ finding }, 'db:verify: drift');
    }
    throw new AppError(
      `Schema drift detected: ${report.drift.length} finding(s). backend/migrations/*.sql is authoritative; reconcile it or schema.ts, never both.`,
      { status: 500, code: 'schema_drift_detected' },
    );
  }

  logger.info('db:verify: schema.ts matches the live database');
}

if (require.main === module) {
  main().catch((error: unknown) => {
    logger.error({ err: error }, 'db:verify: failed');
    process.exit(1);
  });
}
