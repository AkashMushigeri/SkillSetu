import pino from 'pino';

const usePrettyLogs = process.env.LOG_PRETTY === 'true';

export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  redact: {
    paths: [
      'req.headers.authorization',
      'request.headers.authorization',
      'headers.authorization',
      'authorization',
      '*.password',
      '*.privateKey',
      '*.private_key',
      'DATABASE_URL',
      'GEMINI_API_KEY',
      'FIREBASE_PRIVATE_KEY',
    ],
    censor: '[redacted]',
  },
  ...(usePrettyLogs ? { transport: { target: 'pino-pretty' } } : {}),
});

export type Logger = typeof logger;