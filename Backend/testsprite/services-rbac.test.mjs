import axios from 'axios';

const BASE = 'https://luckiness-avalanche-uncombed.ngrok-free.dev/api/v1';

async function test() {
  // Test 1: GET /services is public — no auth required
  const listRes = await axios.get(`${BASE}/services`, { validateStatus: () => true });
  if (listRes.status !== 200) {
    throw new Error(`GET /services: expected 200, got ${listRes.status}`);
  }
  if (!Array.isArray(listRes.data)) {
    throw new Error(`GET /services: expected array, got ${typeof listRes.data}`);
  }

  // Test 2: POST /services without auth returns 401
  const createNoAuth = await axios.post(`${BASE}/services`, {
    title: 'Unauthorized Service',
    base_price: 1000,
    estimated_duration_mins: 60,
  }, { validateStatus: () => true });

  if (createNoAuth.status !== 401) {
    throw new Error(`POST /services no auth: expected 401, got ${createNoAuth.status}`);
  }

  // Test 3: POST /services with fake JWT returns 401
  const createFakeAuth = await axios.post(`${BASE}/services`, {
    title: 'Fake Auth Service',
    base_price: 2000,
  }, {
    headers: { Authorization: 'Bearer fake_token_here' },
    validateStatus: () => true,
  });

  if (createFakeAuth.status !== 401) {
    throw new Error(`POST /services fake JWT: expected 401, got ${createFakeAuth.status}`);
  }

  // Test 4: PATCH /services/:id without auth returns 401
  const patchNoAuth = await axios.patch(
    `${BASE}/services/00000000-0000-0000-0000-000000000000`,
    { base_price: 9999 },
    { validateStatus: () => true },
  );

  if (patchNoAuth.status !== 401) {
    throw new Error(`PATCH /services no auth: expected 401, got ${patchNoAuth.status}`);
  }

  // Test 5: DELETE /services/:id without auth returns 401
  const deleteNoAuth = await axios.delete(
    `${BASE}/services/00000000-0000-0000-0000-000000000000`,
    { validateStatus: () => true },
  );

  if (deleteNoAuth.status !== 401) {
    throw new Error(`DELETE /services no auth: expected 401, got ${deleteNoAuth.status}`);
  }

  // Test 6: GET /services/:id with non-existent UUID returns 404
  const getOneRes = await axios.get(
    `${BASE}/services/00000000-0000-0000-0000-000000000001`,
    { validateStatus: () => true },
  );

  if (getOneRes.status !== 404) {
    throw new Error(`GET /services/bad-id: expected 404, got ${getOneRes.status}`);
  }

  console.log('✅ All Services RBAC tests passed');
}

test().catch(e => { console.error(e.message); process.exit(1); });
