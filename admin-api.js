(() => {
  const endpoint = '/api/admin';
  const listeners = new Set();
  let latestSnapshot = null;
  let pollTimer = null;
  let polling = false;
  let sessionExpired = false;
  let localMode = false;
  let localProductIds = new Set();

  function localError(code, message, status = 400) {
    const error = new Error(message);
    error.code = code;
    error.status = status;
    return error;
  }

  function readLocal(key, fallback) {
    const value = window.localStorage.getItem(key);
    if (value === null) return fallback;
    try {
      return JSON.parse(value);
    } catch {
      throw localError('invalid_local_data', `ლოკალური მონაცემები დაზიანებულია: ${key}`, 500);
    }
  }

  function writeLocal(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }

  function localList(key) {
    const value = readLocal(key, []);
    if (!Array.isArray(value)) throw localError('invalid_local_data', `ლოკალური სია არასწორია: ${key}`, 500);
    return value;
  }

  function localSnapshot() {
    const storedProducts = readLocal('dz-user-products', null);
    const products = storedProducts === null ? readLocal('dz_listings', []) : storedProducts;
    if (!Array.isArray(products)) throw localError('invalid_local_data', 'ლოკალური პროდუქტების სია არასწორია.', 500);
    const paymentRequests = localList('dz-payment-requests');
    const storedOrders = localList('dz-orders');
    const orders = storedOrders.slice();
    const knownOrderIds = new Set(orders.map(order => String(order.id)));
    paymentRequests.filter(request => request.type === 'order').forEach(request => {
      const id = String(request.orderId || request.id || '');
      if (!id || knownOrderIds.has(id)) return;
      const details = request.details || {};
      const buyer = details.buyer || {};
      const productIds = Array.isArray(details.productIds) ? details.productIds : [];
      orders.push({
        id,
        buyerName: buyer.name || '',
        buyerEmail: buyer.email || request.email || '',
        buyerPhone: buyer.phone || '',
        deliveryAddress: buyer.address || '',
        sellerId: details.sellerId || '',
        items: productIds.map(productId => products.find(product => String(product.id) === String(productId)))
          .filter(Boolean)
          .map(product => ({
            productId: product.id,
            name: product.name || '',
            image: product.mediaUrl || product.image || '',
            price: Number(product.price || 0)
          })),
        total: Number(request.amount || 0),
        paymentStatus: 'simulated',
        status: 'pending',
        createdAt: request.date || '',
        updatedAt: request.date || ''
      });
      knownOrderIds.add(id);
    });
    if (orders.length !== storedOrders.length) writeLocal('dz-orders', orders);
    return {
      products,
      paymentRequests,
      users: localList('dz-users').map((user, index) => ({
        ...user,
        id: String(user.id || user.uid || user.email || `local-user-${index}`),
        profileCollection: 'users'
      })),
      userProfiles: [],
      settings: { commissionRate: Number(readLocal('dz-commission-rate', 12)) },
      siteConfig: readLocal('dz-site-config', {}),
      transactions: localList('dz-transactions'),
      payouts: localList('dz-payout-requests'),
      orders,
      vendors: [], disputes: [], categories: [], tags: [], promoCodes: [],
      sponsors: [], ads: [], reports: [], auditLogs: []
    };
  }

  function localMutation(action, payload) {
    const id = String(payload.id || '');
    if (action === 'snapshot') return localSnapshot();
    if (action === 'update-product' || action === 'delete-product') {
      const products = localSnapshot().products;
      const index = products.findIndex(product => String(product.id) === id);
      if (index < 0) throw localError('product_not_found', 'პროდუქტი ვერ მოიძებნა.', 404);
      if (action === 'delete-product') products.splice(index, 1);
      else products[index] = { ...products[index], ...payload.updates };
      writeLocal('dz-user-products', products);
      writeLocal('dz_listings', products);
      return action === 'delete-product' ? { deleted: true } : { updated: true };
    }
    if (action === 'update-order') {
      const orders = localList('dz-orders');
      const index = orders.findIndex(order => String(order.id) === id);
      if (index < 0) throw localError('order_not_found', 'შეკვეთა ვერ მოიძებნა.', 404);
      const current = orders[index].status;
      const status = payload.status;
      if (!((current === 'pending' && status === 'shipped') || (current === 'shipped' && status === 'delivered'))) {
        throw localError('invalid_order_transition', 'შეკვეთის სტატუსის ეს გადასვლა დაუშვებელია.', 409);
      }
      orders[index] = {
        ...orders[index],
        status,
        updatedAt: new Date().toISOString(),
        ...(status === 'shipped' ? { shippedAt: new Date().toISOString() } : {}),
        ...(status === 'delivered' ? { deliveredAt: new Date().toISOString(), escrowStatus: 'held' } : {})
      };
      writeLocal('dz-orders', orders);
      return { updated: true };
    }
    if (action === 'update-payment') {
      const requests = localList('dz-payment-requests');
      const index = requests.findIndex(request => String(request.id) === id);
      if (index < 0) throw localError('payment_not_found', 'გადახდის მოთხოვნა ვერ მოიძებნა.', 404);
      requests[index] = { ...requests[index], status: payload.status, reviewedAt: new Date().toISOString() };
      writeLocal('dz-payment-requests', requests);
      return { updated: true };
    }
    if (action === 'save-commission') {
      const rate = Number(payload.rate);
      if (!Number.isFinite(rate) || rate < 0 || rate > 100) {
        throw localError('invalid_commission_rate', 'საკომისიო უნდა იყოს 0-დან 100%-მდე.');
      }
      writeLocal('dz-commission-rate', rate);
      return { saved: true };
    }
    if (action === 'update-user') {
      const key = payload.profileCollection === 'userProfiles' ? 'userProfiles' : 'users';
      const users = key === 'users' ? localList('dz-users') : [];
      const index = users.findIndex(user => String(user.id || user.uid || user.email) === id);
      if (index < 0) throw localError('user_not_found', 'მომხმარებელი ვერ მოიძებნა.', 404);
      users[index] = { ...users[index], ...payload.updates };
      if (key === 'users') writeLocal('dz-users', users);
      return { updated: true };
    }
    throw localError('local_action_unavailable', 'ეს მოქმედება ლოკალურ რეჟიმში მიუწვდომელია.', 503);
  }

  function canUseLocalMode(error) {
    return error?.code === 'admin_api_unavailable'
      || error?.code === 'admin_pin_not_configured'
      || error?.code === 'admin_session_secret_invalid'
      || error?.code === 'firebase_admin_not_configured';
  }

  function makeError(data, status) {
    const error = new Error(data?.message || `Admin API request failed (${status}).`);
    error.code = data?.error || 'admin_api_failed';
    error.status = status;
    return error;
  }

  function notifySessionExpired(error) {
    if (error?.status !== 401 || sessionExpired) return;
    sessionExpired = true;
    document.dispatchEvent(new Event('dropzone-admin-session-expired'));
  }

  async function request(method, body, allowLocalFallback = false) {
    const options = {
      method,
      credentials: 'same-origin',
      headers: { Accept: 'application/json' }
    };
    if (body) {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(body);
    }
    let response;
    try {
      response = await fetch(endpoint, options);
    } catch {
      throw localError('admin_api_unavailable', 'ადმინისტრაციულ სერვერთან კავშირი ვერ დამყარდა.', 503);
    }
    const isJson = response.headers.get('content-type')?.includes('application/json');
    if (allowLocalFallback && !isJson) {
      throw localError('admin_api_unavailable', 'ადმინისტრაციული API ამ მისამართზე მიუწვდომელია; გამოიყენება ამ ბრაუზერის მონაცემები.', 503);
    }
    const data = isJson
      ? await response.json() : {};
    if (!response.ok) {
      const error = makeError(data, response.status);
      if (allowLocalFallback && response.status === 404) {
        error.code = 'admin_api_unavailable';
      }
      notifySessionExpired(error);
      throw error;
    }
    return data;
  }

  async function call(action, payload = {}) {
    const localProductMutation = !localMode
      && ['update-product', 'delete-product'].includes(action)
      && localProductIds.has(String(payload.id || ''));
    const result = localMode || localProductMutation
      ? localMutation(action, payload)
      : (await request('POST', { action, ...payload })).result;
    if (action !== 'snapshot') refreshSoon();
    return result;
  }

  async function poll() {
    if (polling || !listeners.size) return;
    polling = true;
    try {
      const snapshot = await call('snapshot');
      if (localMode) {
        localProductIds.clear();
        latestSnapshot = snapshot;
      } else {
        const storedProducts = readLocal('dz-user-products', null);
        const localProducts = storedProducts === null ? readLocal('dz_listings', []) : storedProducts;
        if (!Array.isArray(localProducts)) {
          throw localError('invalid_local_data', 'ლოკალური პროდუქტების სია არასწორია.', 500);
        }
        const remoteProducts = Array.isArray(snapshot.products) ? snapshot.products : [];
        const remoteIds = new Set(remoteProducts.map(product => String(product.id)));
        const localOnlyProducts = localProducts.filter(product => product?.id !== undefined
          && !remoteIds.has(String(product.id)));
        localProductIds = new Set(localOnlyProducts.map(product => String(product.id)));
        latestSnapshot = {
          ...snapshot,
          products: [...remoteProducts, ...localOnlyProducts]
        };
      }
      sessionExpired = false;
      listeners.forEach(listener => {
        try {
          listener.onChange(latestSnapshot);
        } catch (error) {
          console.error('Unable to render admin data snapshot.', error);
        }
      });
    } catch (error) {
      listeners.forEach(listener => listener.onError(error));
    } finally {
      polling = false;
    }
  }

  function refreshSoon() {
    if (!listeners.size) return;
    window.clearTimeout(pollTimer);
    pollTimer = window.setTimeout(poll, 150);
  }

  window.addEventListener('storage', event => {
    if (![
      'dz-user-products', 'dz_listings', 'dz-users', 'dz-payment-requests',
      'dz-orders', 'dz-commission-rate', 'dz-transactions', 'dz-payout-requests',
      'dz-site-config'
    ].includes(event.key)) return;
    refreshSoon();
  });

  function subscribe(onChange, onError) {
    const listener = { onChange, onError: onError || (error => console.error(error)) };
    listeners.add(listener);
    if (latestSnapshot) onChange(latestSnapshot);
    if (!pollTimer) poll();
    if (!subscribe.interval) subscribe.interval = window.setInterval(poll, 10000);
    return () => {
      listeners.delete(listener);
      if (!listeners.size) {
        window.clearTimeout(pollTimer);
        window.clearInterval(subscribe.interval);
        pollTimer = null;
        subscribe.interval = null;
        latestSnapshot = null;
      }
    };
  }

  function collectionSubscription(collection, onChange, onError) {
    return subscribe(snapshot => onChange(snapshot[collection] || []), onError);
  }

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || '').split(',')[1] || '');
      reader.onerror = () => reject(new Error('სურათის წაკითხვა ვერ მოხერხდა.'));
      reader.readAsDataURL(file);
    });
  }

  window.DropZoneAdminApi = {
    async getSession() {
      try {
        const result = await request('GET', undefined, true);
        sessionExpired = false;
        if (result.localFallback) {
          localSnapshot();
          localMode = true;
          return { authenticated: true, mode: 'local', expiresAt: Date.now() + 8 * 60 * 60 * 1000 };
        }
        return result;
      } catch (error) {
        if (error.status === 401) return { authenticated: false };
        if (canUseLocalMode(error)) {
          localSnapshot();
          localMode = true;
          return { authenticated: true, mode: 'local', expiresAt: Date.now() + 8 * 60 * 60 * 1000 };
        }
        throw error;
      }
    },
    login(pin) {
      return request('POST', { action: 'login', pin }).then(result => {
        sessionExpired = false;
        return result;
      }).catch(error => {
        if (!canUseLocalMode(error)) throw error;
        localSnapshot();
        localMode = true;
        return { authenticated: true, mode: 'local', expiresAt: Date.now() + 8 * 60 * 60 * 1000 };
      });
    },
    logout() {
      if (localMode) {
        localMode = false;
        latestSnapshot = null;
        return Promise.resolve({ authenticated: false });
      }
      return request('DELETE').finally(() => {
        sessionExpired = false;
      });
    },
    subscribeAdminProducts(onChange, onError) {
      return collectionSubscription('products', onChange, onError);
    },
    subscribeAdminPayments(onChange, onError) {
      return collectionSubscription('paymentRequests', onChange, onError);
    },
    subscribeAdminUsers(onChange, onError) {
      return subscribe(snapshot => {
        const merged = new Map((snapshot.userProfiles || []).map(user => [String(user.id), {
          ...user, profileCollection: 'userProfiles'
        }]));
        (snapshot.users || []).forEach(user => merged.set(String(user.id), {
          ...user, profileCollection: 'users'
        }));
        onChange([...merged.values()].sort((left, right) => {
          const dateOf = value => new Date(value || 0).getTime();
          return dateOf(right.createdAt) - dateOf(left.createdAt);
        }));
      }, onError);
    },
    subscribeAdminCollection(collection, onChange, onError) {
      return collectionSubscription(collection, onChange, onError);
    },
    subscribeAdminOrders(onChange, onError) {
      return Promise.resolve(collectionSubscription('orders', onChange, onError));
    },
    subscribeSettings(onChange, onError) {
      return subscribe(snapshot => onChange(snapshot.settings || {}), onError);
    },
    subscribeSiteConfig(onChange, onError) {
      return subscribe(snapshot => onChange(snapshot.siteConfig || {}), onError);
    },
    createAdminRecord(collection, data) {
      return call('create-record', { collection, data });
    },
    updateAdminRecord(collection, id, updates) {
      return call('update-record', { collection, id, updates });
    },
    deleteAdminRecord(collection, id) {
      return call('delete-record', { collection, id });
    },
    updateProduct(id, updates) {
      return call('update-product', { id, updates });
    },
    deleteProduct(id) {
      return call('delete-product', { id });
    },
    updateAdminUser(id, profileCollection, updates) {
      return call('update-user', { id, profileCollection, updates });
    },
    updateAdminPayment(id, status) {
      return call('update-payment', { id, status });
    },
    saveCommissionRate(rate) {
      return call('save-commission', { rate });
    },
    updateOrderStatus(id, status) {
      return call('update-order', { id, status });
    },
    approveVendor(id, updates) {
      return call('approve-vendor', { id, updates });
    },
    setVendorBlocked(id, blocked) {
      return call('set-vendor-blocked', { id, blocked });
    },
    recordDisputeRefund(disputeId, transactionId) {
      return call('record-dispute-refund', { disputeId, transactionId });
    },
    async uploadAdminMedia(file, folder) {
      if (!(file instanceof File) || file.size > 2 * 1024 * 1024) {
        throw new Error('აირჩიე 2 მბ-მდე ზომის სურათი.');
      }
      return call('upload-media', {
        folder,
        file: { fileName: file.name, mimeType: file.type, base64: await fileToBase64(file) }
      });
    },
    saveAdminSiteConfig(updates) {
      return call('save-site-config', { updates });
    }
  };
})();
