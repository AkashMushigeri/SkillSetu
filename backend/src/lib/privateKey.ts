import { AppError } from './errors';

/**
 * Firebase service-account private keys survive a surprisingly hostile trip from the
 * Firebase console to a process environment, and every mangling looks identical from
 * the outside: OpenSSL refuses the PEM with `DECODER routines::unsupported` and no
 * hint about which byte was wrong.
 *
 * These are the shapes that actually arrive:
 *
 * - Wrapped in quotes. The value in `.env.example` used to be shown as
 *   `"-----BEGIN PRIVATE KEY-----\n...`, and a dashboard that stores what you paste
 *   keeps both `"` characters. `trim()` does not remove them, so the PEM header is no
 *   longer at offset 0 and OpenSSL cannot find it. This was a real production
 *   outage, not a hypothetical.
 * - `\n` escapes, which is how a single-line env var has to carry a multi-line PEM.
 * - `\r\n` escapes and real CRLF, from a Windows editor.
 *
 * Normalising all of them here means one canonical LF-delimited PEM reaches the SDK.
 * Stripping one layer of matching quotes cannot change the key material, and the
 * result is validated below, so this cannot silently accept the wrong key.
 */
export function normalisePrivateKey(raw: string): string {
  let value = raw.trim();

  const isDoubleQuoted = value.startsWith('"') && value.endsWith('"') && value.length >= 2;
  const isSingleQuoted = value.startsWith("'") && value.endsWith("'") && value.length >= 2;

  if (isDoubleQuoted || isSingleQuoted) {
    value = value.slice(1, -1).trim();
  }

  return value
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trim();
}

const PEM_ENVELOPE = /-----BEGIN (?:[A-Z0-9 ]+ )?PRIVATE KEY-----/;
const PEM_FOOTER = /-----END (?:[A-Z0-9 ]+ )?PRIVATE KEY-----/;

/**
 * Fails closed, and says what to do about it.
 *
 * The alternative — handing a malformed PEM to `cert()` — produces a raw OpenSSL
 * decoder error that points at nothing actionable, which is exactly how the quoted
 * key cost a debugging cycle. Checking the envelope here cannot weaken anything: a
 * value without a well-formed BEGIN/END pair is never a usable key, so rejecting it
 * early removes no valid configuration.
 *
 * The body is intentionally not echoed. It is key material.
 */
export function assertUsablePrivateKey(privateKey: string): string {
  const value = normalisePrivateKey(privateKey);

  const begin = PEM_ENVELOPE.exec(value);
  const end = PEM_FOOTER.exec(value);

  if (!begin || !end || end.index < begin.index) {
    throw new AppError(
      'Refusing to start: FIREBASE_PRIVATE_KEY is not a usable PEM private key. ' +
        'It must contain a complete "-----BEGIN PRIVATE KEY-----" ... "-----END PRIVATE KEY-----" ' +
        'pair, and must not include surrounding quote characters. Paste the key from the ' +
        'service-account JSON; the backend converts \\n escapes and CRLF line endings itself. ' +
        'Key material is never logged.',
      { status: 500, code: 'firebase_private_key_malformed' },
    );
  }

  return value;
}