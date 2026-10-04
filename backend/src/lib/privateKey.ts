import { createPrivateKey } from 'node:crypto';
import { AppError } from './errors';

/**
 * A service-account key reaches a process environment after being copied out of the
 * Firebase console, and the dashboard stores whatever was pasted. Several distinct
 * transports all corrupt a PEM, and OpenSSL reports every one of them identically:
 *
 *   error:1E08010C:DECODER routines::unsupported
 *
 * Verified locally against a generated key — all of these produce that exact error:
 *
 *   - newlines collapsed onto one line      (the dashboard eating real newlines)
 *   - spaces where newlines were            (a display or wrapping artefact)
 *   - literal backslash-n left unconverted  (a JSON string copied as raw text)
 *   - literal backslash-backslash-n         (JSON copied after a second escape)
 *   - a surrounding double quote kept from the .env.example shape
 *
 * A PEM is not just its BEGIN/END markers: OpenSSL requires the header to be followed
 * by a newline and the base64 body to be line-wrapped, so a value can contain both
 * markers and still be unusable. That is why checking for the markers is not enough
 * and why this module rebuilds the block instead.
 *
 * The key material is never logged, echoed or included in any error message.
 */

const PEM_BEGIN = /-{5}BEGIN ([A-Z0-9 ]*PRIVATE KEY)-{5}/;
const PEM_END = /-{5}END ([A-Z0-9 ]*PRIVATE KEY)-{5}/;
const NOT_BASE64 = new RegExp('[^A-Za-z0-9+/=]', 'g');
const PURE_BASE64 = /^[A-Za-z0-9+/=]+$/;
const BASE64_LINE_LENGTH = 64;

/**
 * Non-secret facts about the stored value.
 *
 * Deliberately structural only: lengths, counts and booleans. None of it narrows down
 * the key itself, and all of it is what is needed to tell a collapsed newline apart
 * from a truncated key after the fact. This is logged at boot precisely so that a
 * future failure is diagnosable from the deploy log without guessing.
 */
export type PrivateKeyShape = {
  byteLength: number;
  lineCount: number;
  hasRealNewlines: boolean;
  hasLiteralEscapes: boolean;
  hasSurroundingQuotes: boolean;
  hasBeginMarker: boolean;
  hasEndMarker: boolean;
  bodyIsBase64: boolean;
};

export function describePrivateKeyShape(raw: string): PrivateKeyShape {
  const value = raw.trim();
  const begin = PEM_BEGIN.exec(value);
  const end = PEM_END.exec(value);

  const bodyStart = begin && end ? begin.index + begin[0].length : 0;
  const bodyEnd = begin && end ? end.index : value.length;
  const body = bodyStart < bodyEnd ? value.slice(bodyStart, bodyEnd) : '';

  return {
    byteLength: Buffer.byteLength(value, 'utf8'),
    lineCount: value.split('\n').length,
    hasRealNewlines: value.includes('\n'),
    hasLiteralEscapes: value.includes('\\n'),
    hasSurroundingQuotes:
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'")),
    hasBeginMarker: begin !== null,
    hasEndMarker: end !== null,
    // Line breaks are legitimate PEM formatting, so they are ignored here. What this
    // answers is whether the characters between the markers are key material at all.
    bodyIsBase64: body.length > 0 && PURE_BASE64.test(body.replace(/\s+/g, '')),
  };
}

function stripSurroundingQuotes(value: string): string {
  const quoted =
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"));

  return quoted && value.length >= 2 ? value.slice(1, -1).trim() : value;
}

function unfold(value: string): string {
  return value
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');
}

function wrapAtWidth(body: string, width: number): string {
  const lines: string[] = [];

  for (let offset = 0; offset < body.length; offset += width) {
    lines.push(body.slice(offset, offset + width));
  }

  return lines.join('\n');
}

function malformed(detail: string): AppError {
  return new AppError(
    `Refusing to start: FIREBASE_PRIVATE_KEY is unusable (${detail}). It must be the private_key ` +
      'field of a Firebase service-account JSON, including the -----BEGIN PRIVATE KEY----- and ' +
      '-----END PRIVATE KEY----- lines. Copy the value only: no surrounding quotes, no trailing ' +
      'comma, no JSON braces. The backend rebuilds the PEM, so \n escapes, CRLF endings and ' +
      'collapsed line breaks are all handled. Key material is never logged.',
    { status: 500, code: 'firebase_private_key_malformed' },
  );
}

/**
 * Rebuilds a canonical, correctly line-wrapped PEM from whatever arrived.
 *
 * Everything between the markers is reduced to its base64 characters and re-wrapped at
 * the standard 64-column width, so the header is always followed by a newline and the
 * body is always well formed however it was transported. Escapes, spaces, collapsed
 * newlines and stray backslashes cannot survive this, because none of them are base64.
 *
 * The BEGIN label is preserved rather than assumed, so a PKCS#1 RSA key is not silently
 * relabelled as PKCS#8.
 */
export function normalisePrivateKey(raw: string): string {
  const value = unfold(stripSurroundingQuotes(raw.trim())).trim();

  const begin = PEM_BEGIN.exec(value);
  const end = PEM_END.exec(value);

  if (!begin || !end) {
    throw malformed('no PEM BEGIN/END pair was found');
  }

  if (begin[1] !== end[1]) {
    throw malformed(`BEGIN and END disagree (${begin[1]} vs ${end[1]})`);
  }

  if (end.index <= begin.index + begin[0].length) {
    throw malformed('there is no key material between the markers');
  }

  const body = value.slice(begin.index + begin[0].length, end.index).replace(NOT_BASE64, '');

  if (body.length === 0) {
    throw malformed('there is no key material between the markers');
  }

  const label = begin[1];
  const dashes = '-'.repeat(5);

  return [
    `${dashes}BEGIN ${label}${dashes}`,
    wrapAtWidth(body, BASE64_LINE_LENGTH),
    `${dashes}END ${label}${dashes}`,
    '',
  ].join('\n');
}

/**
 * Fails closed with something actionable, and only after the key genuinely works.
 *
 * `createPrivateKey` is the exact call firebase-admin makes inside `cert(...)`, so
 * running it here means the credential that reaches the SDK has already been proven
 * loadable. The alternative is what shipped twice: an OpenSSL decoder error with no
 * indication of which byte was wrong, in a crash loop.
 *
 * This cannot reject a key that would have worked — it accepts anything
 * `createPrivateKey` accepts — and it removes no safeguard: a value that fails here
 * would have crashed the service anyway.
 */
export function assertUsablePrivateKey(raw: string): string {
  const normalised = normalisePrivateKey(raw);

  try {
    createPrivateKey(normalised);
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'unknown error';

    throw malformed(`OpenSSL rejected the reconstructed key (${reason})`);
  }

  return normalised;
}