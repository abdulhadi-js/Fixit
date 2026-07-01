import axios from 'axios';

const BASE = 'https://luckiness-avalanche-uncombed.ngrok-free.dev/api/v1';

async function test() {
  // Test 1: POST /bookings without auth returns 401
  const bookNoAuth = await axios.post(`${BASE}/bookings`, {
    service_id: '00000000-0000-0000-0000-000000000000',
    technician_id: '00000000-0000-0000-0000-000000000000',
    scheduled_start: '2026-08-01T10:00:00Z',
    address_details: { area: 'DHA', street: 'St 1', house: 'H1' },
  }, { validateStatus: () => true });

  if (bookNoAuth.status !== 401) {
    throw new Error(`POST /bookings no auth: expected 401, got ${bookNoAuth.status}`);
  }

  // Test 2: GET /bookings/availability without auth returns 401
  const availNoAuth = await axios.get(
    `${BASE}/bookings/availability?service_id=test&scheduled_start=2026-08-01T10:00:00Z`,
    { validateStatus: () => true },
  );

  if (availNoAuth.status !== 401) {
    throw new Error(`GET /bookings/availability no auth: expected 401, got ${availNoAuth.status}`);
  }

  // Test 3: GET /bookings/my without auth returns 401
  const myNoAuth = await axios.get(`${BASE}/bookings/my`, { validateStatus: () => true });

  if (myNoAuth.status !== 401) {
    throw new Error(`GET /bookings/my no auth: expected 401, got ${myNoAuth.status}`);
  }

  // Test 4: GET /bookings/agenda without auth returns 401
  const agendaNoAuth = await axios.get(`${BASE}/bookings/agenda`, { validateStatus: () => true });

  if (agendaNoAuth.status !== 401) {
    throw new Error(`GET /bookings/agenda no auth: expected 401, got ${agendaNoAuth.status}`);
  }

  // Test 5: PATCH /bookings/:id/status without auth returns 401
  const statusNoAuth = await axios.patch(
    `${BASE}/bookings/00000000-0000-0000-0000-000000000000/status`,
    { status: 'IN_PROGRESS' },
    { validateStatus: () => true },
  );

  if (statusNoAuth.status !== 401) {
    throw new Error(`PATCH /bookings/status no auth: expected 401, got ${statusNoAuth.status}`);
  }

  // Test 6: POST /bookings with fake JWT returns 401
  const bookFakeAuth = await axios.post(`${BASE}/bookings`, {
    service_id: '00000000-0000-0000-0000-000000000000',
    technician_id: '00000000-0000-0000-0000-000000000000',
    scheduled_start: '2026-08-01T10:00:00Z',
    address_details: { area: 'DHA', street: 'St 1', house: 'H1' },
  }, {
    headers: { Authorization: 'Bearer fake.jwt.token' },
    validateStatus: () => true,
  });

  if (bookFakeAuth.status !== 401) {
    throw new Error(`POST /bookings fake JWT: expected 401, got ${bookFakeAuth.status}`);
  }

  console.log('✅ All Bookings auth-guard tests passed');
}

test().catch(e => { console.error(e.message); process.exit(1); });
