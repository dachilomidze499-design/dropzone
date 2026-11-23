const assert = require('node:assert/strict');
const { after, beforeEach, test } = require('node:test');
const adminApi = require('./admin');

const testPin = 'test-pin';
const originalEnvironment = {
  ADMIN_PIN: process.env.ADMIN_PIN,
  ADMIN_SESSION_SECRET: process.env.ADMIN_SESSION_SECRET,
  DROPZONE_ADMIN_MODE: process.env.DROPZONE_ADMIN_MODE,
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  NODE_ENV: process.env.NODE_ENV,
  VERCEL_ENV: process.env.VERCEL_ENV
};

function restoreEnvironment() {
  Object.entries(originalEnvironment).forEach(([key, value]) => {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  });
}

beforeEach(() => {
  process.env.ADMIN_PIN = testPin;
  process.env.ADMIN_SESSION_SECRET = 'test-session-secret-with-at-least-32-characters';
  process.env.DROPZONE_ADMIN_MODE = 'test';
  process.env.NODE_ENV = 'test';
  delete process.env.VERCEL_ENV;
  delete process.env.FIREBASE_CLIENT_EMAIL;
  delete process.env.FIREBASE_PRIVATE_KEY;
  delete process.env.FIREBASE_PROJECT_ID;
  globalThis.__dropzoneAdminPinAttempts = new Map();
  delete globalThis.__dropzoneAdminTestStore;
});

after(restoreEnvironment);

async function dispatch(method, body, { cookie = '', origin = 'http://dropzone.test', ip = '192.0.2.1' } = {}) {
  const response = {
    statusCode: 200,
    headers: {},
    setHeader(name, value) {
      this.headers[name] = value;
      return this;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(value) {
      this.body = value;
      return this;
    }
  };
  await adminApi({
    method,
    headers: {
      host: 'dropzone.test',
      origin,
      cookie,
      'x-forwarded-for': ip
    },
    body,
    socket: { remoteAddress: '127.0.0.1' }
  }, response);
  return response;
}

test('local test mode serves isolated admin data without a PIN session', async () => {
  delete process.env.ADMIN_PIN;
  delete process.env.ADMIN_SESSION_SECRET;
  const session = await dispatch('GET');
  assert.equal(session.statusCode, 200);
  assert.equal(session.body.authenticated, true);
  assert.equal(session.body.mode, 'test');

  const snapshot = await dispatch('POST', { action: 'snapshot' });
  assert.equal(snapshot.statusCode, 200);
  assert.equal(snapshot.body.result.products[0].id, 'test-product-pending');
  assert.equal(snapshot.body.result.users[0].id, 'test-seller');

  const login = await dispatch('POST', { action: 'login' });
  assert.equal(login.statusCode, 200);
  assert.equal(login.body.mode, 'test');
});

test('missing or invalid PIN session configuration is reported without exposing values', async () => {
  delete process.env.DROPZONE_ADMIN_MODE;
  delete process.env.ADMIN_PIN;
  const missingPin = await dispatch('GET');
  assert.equal(missingPin.statusCode, 503);
  assert.equal(missingPin.body.error, 'admin_pin_not_configured');
  assert.match(missingPin.body.message, /ADMIN_PIN/);

  process.env.ADMIN_PIN = testPin;
  process.env.ADMIN_SESSION_SECRET = 'short-secret';
  const shortSecret = await dispatch('GET');
  assert.equal(shortSecret.statusCode, 503);
  assert.equal(shortSecret.body.error, 'admin_session_secret_invalid');
  assert.match(shortSecret.body.message, /ADMIN_SESSION_SECRET/);
  assert.doesNotMatch(shortSecret.body.message, /short-secret/);
});

test('production PIN throttling reports missing Firebase configuration', async () => {
  delete process.env.DROPZONE_ADMIN_MODE;
  const correctlyEntered = await dispatch('POST', { action: 'login', pin: testPin });
  assert.equal(correctlyEntered.statusCode, 503);
  assert.equal(correctlyEntered.body.error, 'firebase_admin_not_configured');
});

test('malformed Firebase credentials return a clear configuration error', async () => {
  delete process.env.DROPZONE_ADMIN_MODE;
  process.env.FIREBASE_PROJECT_ID = 'dropzone-test';
  process.env.FIREBASE_CLIENT_EMAIL = 'admin@dropzone-test.iam.gserviceaccount.com';
  process.env.FIREBASE_PRIVATE_KEY = 'not-a-private-key';

  const response = await dispatch('POST', { action: 'login', pin: testPin });
  assert.equal(response.statusCode, 503);
  assert.equal(response.body.error, 'firebase_admin_configuration_invalid');
  assert.match(response.body.message, /FIREBASE_PRIVATE_KEY/);
  assert.doesNotMatch(response.body.message, /not-a-private-key/);
});

test('admin mutations reject untrusted origins', async () => {
  const response = await dispatch('POST', { action: 'login', pin: testPin }, {
    origin: 'https://attacker.example'
  });
  assert.equal(response.statusCode, 403);
});

test('production mode rejects admin API access without a PIN session', async () => {
  delete process.env.DROPZONE_ADMIN_MODE;
  const session = await dispatch('GET');
  assert.equal(session.statusCode, 401);

  const snapshot = await dispatch('POST', { action: 'snapshot' });
  assert.equal(snapshot.statusCode, 401);
});

test('local test mode is unavailable on Vercel Preview', async () => {
  process.env.VERCEL_ENV = 'preview';
  const loggedErrors = [];
  const originalConsoleError = console.error;
  console.error = (...args) => loggedErrors.push(args);
  try {
    const response = await dispatch('GET');
    assert.equal(response.statusCode, 401);
    assert.equal(response.body.error, 'session_required');
    assert.equal(loggedErrors.length, 0);
  } finally {
    console.error = originalConsoleError;
  }
});
