import assert from 'node:assert/strict';
import { createPrivateKey, generateKeyPairSync } from 'node:crypto';
import { describe, it } from 'node:test';
import { assertUsablePrivateKey, normalisePrivateKey } from '../src/lib/privateKey';

/**
 * These tests reproduce a real production outage: a service-account key pasted into
 * Render with a surrounding double quote failed at boot with
 * `error:1E08010C:DECODER routines::unsupported`. No key material is used here — a
 * throwaway keypair is generated per run — but the failure mode is identical because
 * it comes from the PEM framing, not from the key.
 */
describe('FIREBASE_PRIVATE_KEY normalisation', () => {
  const { privateKey } = generateKeyPairSync('ec', {
    namedCurve: 'P-256',
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });

  const asEscapes = privateKey.replace(/\n/g, '\\n');
  const header = '-----BEGIN PRIVATE KEY-----';

  it('strips the surrounding double quotes that caused the outage', () => {
    const quoted = `"${asEscapes}"`;

    // The bug: trim() cannot remove quotes, so the header was not at offset 0.
    assert.equal(quoted.trim().charAt(0), '"');
    assert.notEqual(normalisePrivateKey(quoted).charAt(0), '"');
    assert.equal(normalisePrivateKey(quoted).startsWith(header), true);
  });

  it('strips a surrounding pair of single quotes', () => {
    assert.equal(normalisePrivateKey(`'${asEscapes}'`).startsWith(header), true);
  });

  it('converts literal newline escapes to real newlines', () => {
    assert.equal(normalisePrivateKey(asEscapes).includes('\n'), true);
  });

  it('converts escaped CRLF and real CRLF alike', () => {
    const escaped = privateKey.replace(/\n/g, '\\r\\n');
    const real = privateKey.replace(/\n/g, '\r\n');

    assert.equal(normalisePrivateKey(escaped), normalisePrivateKey(real));
    assert.equal(normalisePrivateKey(real).includes('\r'), false);
  });

  it('is idempotent, so normalising twice changes nothing', () => {
    const once = normalisePrivateKey(`"${asEscapes}"`);

    assert.equal(normalisePrivateKey(once), once);
  });

  it('leaves an already-correct real PEM untouched', () => {
    assert.equal(normalisePrivateKey(privateKey), privateKey.trim());
  });

  it('produces a key OpenSSL accepts, where the raw quoted value does not', () => {
    // Without normalisation this throws DECODER routines::unsupported.
    assert.throws(() => createPrivateKey(`"${asEscapes}"`));

    const recovered = normalisePrivateKey(`"${asEscapes}"`);

    assert.equal(createPrivateKey(recovered).asymmetricKeyType, 'ec');
  });
});

describe('assertUsablePrivateKey', () => {
  const { privateKey } = generateKeyPairSync('ec', {
    namedCurve: 'P-256',
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });

  it('accepts a quoted key and returns the canonical PEM', () => {
    const escaped = privateKey.replace(/\n/g, '\\n');

    assert.equal(assertUsablePrivateKey(`"${escaped}"`), privateKey.trim());
  });

  it('rejects a value with no PEM envelope', () => {
    assert.throws(() => assertUsablePrivateKey('not-a-key'), {
      code: 'firebase_private_key_malformed',
    });
  });

  it('rejects a BEGIN with no matching END', () => {
    assert.throws(
      () => assertUsablePrivateKey('-----BEGIN PRIVATE KEY-----\nAAAA\n'),
      { code: 'firebase_private_key_malformed' },
    );
  });

  it('rejects an END that precedes its BEGIN', () => {
    const inverted = `-----END PRIVATE KEY-----\nAAAA\n-----BEGIN PRIVATE KEY-----`;

    assert.throws(() => assertUsablePrivateKey(inverted), {
      code: 'firebase_private_key_malformed',
    });
  });

  it('explains the fix and never echoes key material', () => {
    const body = 'AAAA';
    let message = '';

    try {
      assertUsablePrivateKey(body);
      assert.fail('expected a rejection');
    } catch (error) {
      message = (error as Error).message;
    }

    assert.match(message, /FIREBASE_PRIVATE_KEY/);
    assert.match(message, /BEGIN PRIVATE KEY/);
    assert.equal(message.includes(body), false);
  });
});