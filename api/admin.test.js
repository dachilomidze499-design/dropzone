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

test('local test mode requires the configured PIN and serves isolated admin data', async () => {
  const unauthenticated = await dispatch('GET');
  assert.equal(unauthenticated.statusCode, 401);

  const invalidLogin = await dispatch('POST', { action: 'login', pin: 'wrong-pin' });
  assert.equal(invalidLogin.statusCode, 401);
  assert.equal(invalidLogin.body.error, 'invalid_pin');

  const login = await dispatch('POST', { action: 'login', pin: testPin });
  assert.equal(login.statusCode, 200);
  assert.equal(login.body.mode, 'test');
  const cookie = login.headers['Set-Cookie'].split(';')[0];

  const session = await dispatch('GET', undefined, { cookie });
  assert.equal(session.statusCode, 200);
  assert.equal(session.body.authenticated, true);
  assert.equal(session.body.mode, 'test');

  const snapshot = await dispatch('POST', { action: 'snapshot' }, { cookie });
  assert.equal(snapshot.statusCode, 200);
  assert.equal(snapshot.body.result.products[0].id, 'test-product-pending');
  assert.equal(snapshot.body.result.users[0].id, 'test-seller');

  const logout = await dispatch('DELETE', undefined, { cookie });
  assert.equal(logout.statusCode, 200);
  assert.match(logout.headers['Set-Cookie'], /Max-Age=0/);
});

test('missing or invalid PIN session configuration is reported without exposing values', async () => {
  delete process.env.DROPZONE_ADMIN_MODE;
  process.env.FIREBASE_PROJECT_ID = 'dropzone-test';
  process.env.FIREBASE_CLIENT_EMAIL = 'admin@dropzone-test.iam.gserviceaccount.com';
  process.env.FIREBASE_PRIVATE_KEY = 'test-key';
  delete process.env.ADMIN_PIN;
  const missingPin = await dispatch('GET');
  assert.equal(missingPin.statusCode, 200);
  assert.equal(missingPin.body.localFallback, true);

  process.env.ADMIN_PIN = testPin;
  process.env.ADMIN_SESSION_SECRET = 'short-secret';
  const shortSecret = await dispatch('GET');
  assert.equal(shortSecret.statusCode, 503);
  assert.equal(shortSecret.body.error, 'admin_session_secret_invalid');
  assert.match(shortSecret.body.message, /ADMIN_SESSION_SECRET/);
  assert.doesNotMatch(shortSecret.body.message, /short-secret/);
});

test('missing shared-server configuration exposes only a local fallback status', async () => {
  delete process.env.DROPZONE_ADMIN_MODE;
  delete process.env.ADMIN_PIN;
  delete process.env.ADMIN_SESSION_SECRET;

  const status = await dispatch('GET');
  assert.equal(status.statusCode, 200);
  assert.deepEqual(status.body, { authenticated: false, localFallback: true, mode: 'local' });

  const snapshot = await dispatch('POST', { action: 'snapshot' });
  assert.equal(snapshot.statusCode, 503);
  assert.equal(snapshot.body.error, 'admin_pin_not_configured');
});

test('admin commission changes persist in the shared settings snapshot', async () => {
  const login = await dispatch('POST', { action: 'login', pin: testPin });
  const cookie = login.headers['Set-Cookie'].split(';')[0];

  const saved = await dispatch('POST', { action: 'save-commission', rate: 17.5 }, { cookie });
  assert.equal(saved.statusCode, 200);
  assert.deepEqual(saved.body.result, { saved: true });

  const snapshot = await dispatch('POST', { action: 'snapshot' }, { cookie });
  assert.equal(snapshot.body.result.settings.commissionRate, 17.5);
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

test('production mode exposes local fallback status but blocks admin data without a PIN session', async () => {
  delete process.env.DROPZONE_ADMIN_MODE;
  const session = await dispatch('GET');
  assert.equal(session.statusCode, 200);
  assert.equal(session.body.localFallback, true);

  const snapshot = await dispatch('POST', { action: 'snapshot' });
  assert.equal(snapshot.statusCode, 401);
  assert.equal(snapshot.body.error, 'session_expired');
});

test('local test mode is unavailable on Vercel Preview', async () => {
  process.env.VERCEL_ENV = 'preview';
  const loggedErrors = [];
  const originalConsoleError = console.error;
  console.error = (...args) => loggedErrors.push(args);
  try {
    const response = await dispatch('GET');
    assert.equal(response.statusCode, 200);
    assert.equal(response.body.localFallback, true);
    assert.equal(loggedErrors.length, 0);
  } finally {
    console.error = originalConsoleError;
  }
});
