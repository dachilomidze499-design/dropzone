const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

function createOfflineAdminApi(initialStorage, fetchImplementation = async () => { throw new Error('offline'); }) {
  const storage = new Map(Object.entries(initialStorage).map(([key, value]) => [key, JSON.stringify(value)]));
  const window = {
    localStorage: {
      getItem: key => storage.has(key) ? storage.get(key) : null,
      setItem: (key, value) => storage.set(key, String(value))
    },
    setTimeout: () => 1,
    clearTimeout() {},
    setInterval: () => 2,
    clearInterval() {},
    addEventListener() {}
  };
  const source = fs.readFileSync(path.join(__dirname, 'admin-api.js'), 'utf8');
  vm.runInNewContext(source, {
    window,
    document: { dispatchEvent() {} },
    fetch: fetchImplementation
  });
  return {
    api: window.DropZoneAdminApi,
    read(key) {
      const value = storage.get(key);
      return value === undefined ? null : JSON.parse(value);
    }
  };
}

test('offline admin moderates the storefront product localStorage records', async () => {
  const { api, read } = createOfflineAdminApi({
    'dz-user-products': [{
      id: 'local-product',
      name: 'Local product',
      price: 20,
      approvalStatus: 'Pending'
    }]
  });

  const session = await api.getSession();
  assert.equal(session.authenticated, true);
  assert.equal(session.mode, 'local');

  let products = [];
  api.subscribeAdminProducts(items => { products = items; });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(products[0].id, 'local-product');

  await api.updateProduct('local-product', {
    approvalStatus: 'Approved',
    name: 'Updated product',
    price: 24
  });
  assert.equal(read('dz-user-products')[0].approvalStatus, 'Approved');
  assert.equal(read('dz-user-products')[0].name, 'Updated product');
  assert.equal(read('dz-user-products')[0].price, 24);
  assert.equal(read('dz_listings')[0].approvalStatus, 'Approved');

  await api.saveCommissionRate(17.5);
  assert.equal(read('dz-commission-rate'), 17.5);

  await api.deleteProduct('local-product');
  assert.deepEqual(read('dz-user-products'), []);
  assert.deepEqual(read('dz_listings'), []);
});

test('offline admin loads and advances local storefront orders', async () => {
  const { api, read } = createOfflineAdminApi({
    'dz-user-products': [{ id: 'local-item', name: 'Local item', price: 25 }],
    'dz-payment-requests': [{
      id: 'local-payment',
      orderId: 'local-order',
      type: 'order',
      amount: 25,
      date: '2026-01-01T00:00:00.000Z',
      details: {
        productIds: ['local-item'],
        sellerId: 'local-seller',
        buyer: { name: 'Buyer', email: 'buyer@example.test' }
      }
    }]
  });

  await api.getSession();
  let orders = [];
  await api.subscribeAdminOrders(items => { orders = items; });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(orders[0].id, 'local-order');

  await api.updateOrderStatus('local-order', 'shipped');
  assert.equal(read('dz-orders')[0].status, 'shipped');
  assert.ok(read('dz-orders')[0].shippedAt);
});

test('offline admin identifies and updates locally registered customer profiles', async () => {
  const { api, read } = createOfflineAdminApi({
    'dz-users': [{
      email: 'buyer@example.test',
      name: 'Local buyer',
      role: 'private',
      address: 'Tbilisi',
      socials: { phone: '+995555000000' }
    }]
  });

  await api.getSession();
  let users = [];
  api.subscribeAdminUsers(items => { users = items; });
  await new Promise(resolve => setImmediate(resolve));

  assert.equal(users.length, 1);
  assert.equal(users[0].id, 'buyer@example.test');
  assert.equal(users[0].profileCollection, 'users');
  assert.equal(users[0].name, 'Local buyer');

  await api.updateAdminUser(users[0].id, users[0].profileCollection, { verified: true });
  assert.equal(read('dz-users')[0].verified, true);
});

test('admin falls back to local mode when a static host does not provide the API route', async () => {
  const { api } = createOfflineAdminApi({
    'dz-user-products': [{ id: 'local-product', approvalStatus: 'Pending' }]
  }, async () => ({
    ok: false,
    status: 404,
    headers: { get: () => 'text/html; charset=utf-8' },
    json: async () => ({})
  }));

  const session = await api.getSession();
  assert.equal(session.authenticated, true);
  assert.equal(session.mode, 'local');
});

test('admin includes and moderates local storefront products alongside cloud products', async () => {
  const actions = [];
  const response = body => ({
    ok: true,
    status: 200,
    headers: { get: () => 'application/json' },
    json: async () => body
  });
  const { api, read } = createOfflineAdminApi({
    'dz-user-products': [{
      id: 'browser-product',
      name: 'Browser product',
      approvalStatus: 'Pending'
    }]
  }, async (_url, options) => {
    if (options.method === 'GET') {
      return response({
        authenticated: true,
        expiresAt: Date.now() + 60_000,
        mode: 'production'
      });
    }
    const body = JSON.parse(options.body);
    actions.push(body.action);
    return response({
      ok: true,
      result: body.action === 'snapshot'
        ? { products: [{ id: 'cloud-product', approvalStatus: 'Pending' }] }
        : { updated: true }
    });
  });

  await api.getSession();
  let products = [];
  api.subscribeAdminProducts(items => { products = items; });
  await new Promise(resolve => setImmediate(resolve));

  const productIds = products.map(product => product.id).sort();
  assert.equal(productIds.length, 2);
  assert.equal(productIds[0], 'browser-product');
  assert.equal(productIds[1], 'cloud-product');
  await api.updateProduct('browser-product', { approvalStatus: 'Approved' });
  assert.equal(read('dz-user-products')[0].approvalStatus, 'Approved');
  assert.equal(actions.includes('update-product'), false);
});
