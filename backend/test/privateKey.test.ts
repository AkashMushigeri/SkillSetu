import assert from 'node:assert/strict';
import { createPrivateKey, generateKeyPairSync } from 'node:crypto';
import { describe, it } from 'node:test';
import {
  assertUsablePrivateKey,
  describePrivateKeyShape,
  normalisePrivateKey,
} from '../src/lib/privateKey';

/**
 * These tests exist because of a real production crash loop. Every corruption listed
 * below was verified to make OpenSSL fail with the identical, unactionable message
 * `error:1E08010C:DECODER routines::unsupported`, which is what made the original
 * outage expensive to diagnose.
 *
 * No key material is committed: a throwaway keypair is generated per run. The
 * corruption is a property of the PEM framing, not of the key, so this reproduces the
 * failure faithfully.
 */
function freshKey(): string {
  return generateKeyPairSync('ec', {
    namedCurve: 'P-256',
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  }).privateKey;
}

const TRANSPORTS: ReadonlyArray<{ name: string; apply: (key: string) => string }> = [
  { name: 'pristine PEM', apply: (k) => k },
  { name: 'wrapped in double quotes', apply: (k) => `"${k}"` },
  { name: 'wrapped in single quotes', apply: (k) => `'${k}'` },
  { name: 'literal backslash-n escapes', apply: (k) => k.replace(/\n/g, '\\n') },
  { name: 'escaped backslash-r-backslash-n', apply: (k) => k.replace(/\n/g, '\\r\\n') },
  { name: 'real CRLF line endings', apply: (k) => k.replace(/\n/g, '\r\n') },
  { name: 'newlines collapsed to one line', apply: (k) => k.replace(/\n/g, '') },
  { name: 'spaces instead of newlines', apply: (k) => k.replace(/\n/g, ' ') },
  { name: 'quoted and collapsed together', apply: (k) => `"${k.replace(/\n/g, '')}"` },
];

describe('normalisePrivateKey repairs every transport that breaks OpenSSL', () => {
  for (const { name, apply } of TRANSPORTS) {
    it(name, () => {
      const key = freshKey();
      const transported = apply(key);

      // The transported form is what the dashboard actually stores.
      const repaired = normalisePrivateKey(transported);

      assert.equal(createPrivateKey(repaired).asymmetricKeyType, 'ec');
      assert.ok(repaired.startsWith('-----BEGIN PRIVATE KEY-----\n'));
      assert.ok(repaired.trimEnd().endsWith('-----END PRIVATE KEY-----'));
    });
  }

  it('is idempotent', () => {
    const once = normalisePrivateKey(`"${freshKey().replace(/\n/g, '\\n')}"`);

    assert.equal(normalisePrivateKey(once), once);
  });

  it('preserves a PKCS#1 RSA label rather than relabelling it PKCS#8', () => {
    const rsa = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      privateKeyEncoding: { type: 'pkcs1', format: 'pem' },
    }).privateKey;

    assert.ok(rsa.includes('BEGIN RSA PRIVATE KEY'));
    assert.equal(createPrivateKey(normalisePrivateKey(rsa)).asymmetricKeyType, 'rsa');
  });
});

describe('assertUsablePrivateKey fails closed with something actionable', () => {
  const code = { code: 'firebase_private_key_malformed' };

  it('accepts every transport and returns a loadable key', () => {
    for (const { apply } of TRANSPORTS) {
      const usable = assertUsablePrivateKey(apply(freshKey()));

      assert.ok(createPrivateKey(usable));
    }
  });

  it('rejects a value with no PEM markers', () => {
    assert.throws(() => assertUsablePrivateKey('not-a-key-at-all'), code);
  });

  it('rejects a truncated key that cannot be decoded', () => {
    const truncated = freshKey().slice(0, 120);

    assert.throws(() => assertUsablePrivateKey(truncated), code);
  });

  it('rejects a corrupted body even though the markers survive', () => {
    const corrupted = freshKey().replace(/M[A-Za-z0-9+/]{20}/, 'M-not-base64-here!!!!');

    assert.throws(() => assertUsablePrivateKey(corrupted), code);
  });

  it('rejects markers with nothing between them', () => {
    assert.throws(() => assertUsablePrivateKey('-----BEGIN PRIVATE KEY----------END PRIVATE KEY-----'), code);
  });

  it('rejects an END that precedes its BEGIN', () => {
    assert.throws(
      () => assertUsablePrivateKey('-----END PRIVATE KEY-----\nAAAA\n-----BEGIN PRIVATE KEY-----'),
      code,
    );
  });

  it('rejects BEGIN and END labels that disagree', () => {
    assert.throws(
      () => assertUsablePrivateKey('-----BEGIN PRIVATE KEY-----\nAAAA\n-----END RSA PRIVATE KEY-----'),
      code,
    );
  });

  it('explains the fix without ever echoing key material', () => {
    let message = '';

    try {
      assertUsablePrivateKey('-----BEGIN PRIVATE KEY-----\nSECRETBODYHERE\n-----END PRIVATE KEY-----');
      assert.fail('expected a rejection');
    } catch (error) {
      message = (error as Error).message;
    }

    assert.match(message, /FIREBASE_PRIVATE_KEY/);
    assert.match(message, /service-account JSON/);
    assert.equal(message.includes('SECRETBODYHERE'), false);
  });

  it('never lets an OpenSSL decoder error escape unactionable', () => {
    let message = '';

    try {
      assertUsablePrivateKey(freshKey().replace(/M[A-Za-z0-9+/]{20}/, 'M-not-base64-here!!!!'));
      assert.fail('expected a rejection');
    } catch (error) {
      message = (error as Error).message;
    }

    assert.match(message, /Refusing to start/);
    assert.match(message, /service-account JSON/);
  });
});

describe('describePrivateKeyShape reports structure without revealing the key', () => {
  it('flags a collapsed key so the cause is visible in a deploy log', () => {
    const collapsed = freshKey().replace(/\n/g, '');

    const shape = describePrivateKeyShape(collapsed);

    assert.equal(shape.hasBeginMarker, true);
    assert.equal(shape.hasEndMarker, true);
    assert.equal(shape.hasRealNewlines, false);
    assert.equal(shape.lineCount, 1);
  });

  it('flags a quoted key', () => {
    assert.equal(describePrivateKeyShape(`"${freshKey()}"`).hasSurroundingQuotes, true);
  });

  it('flags an unconverted escape', () => {
    const escaped = freshKey().replace(/\n/g, '\\n');

    const shape = describePrivateKeyShape(escaped);

    assert.equal(shape.hasLiteralEscapes, true);
    assert.equal(shape.hasRealNewlines, false);
  });

  it('reports a plausible byte length for a healthy EC key', () => {
    const shape = describePrivateKeyShape(freshKey());

    assert.ok(shape.byteLength > 100);
    assert.equal(shape.hasBeginMarker, true);
    assert.equal(shape.hasEndMarker, true);
    assert.equal(shape.bodyIsBase64, true);
  });
});