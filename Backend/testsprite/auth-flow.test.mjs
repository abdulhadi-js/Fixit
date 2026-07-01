import axios from 'axios';

const BASE = 'https://luckiness-avalanche-uncombed.ngrok-free.dev/api/v1';

async function test() {
  // Test 1: Register a new consumer
  const res = await axios.post(`${BASE}/auth/register`, {
    full_name: 'TS Consumer',
    phone_number: '+923001234560',
    role: 'CONSUMER',
    password: 'SecurePass123',
  }, { validateStatus: () => true });

  // Accept 201 (created) or 409 (already exists from prior run)
  if (res.status !== 201 && res.status !== 409) {
    throw new Error(`Expected 201 or 409, got ${res.status}: ${JSON.stringify(res.data)}`);
  }

  // Test 2: Login with unverified account should return 403
  const loginRes = await axios.post(`${BASE}/auth/login`, {
    phone_number: '+923001234560',
    password: 'SecurePass123',
  }, { validateStatus: () => true });

  if (loginRes.status !== 403) {
    throw new Error(`Unverified login: expected 403, got ${loginRes.status}`);
  }

  // Test 3: Login with wrong password returns 401
  const wrongPassRes = await axios.post(`${BASE}/auth/login`, {
    phone_number: '+923001234560',
    password: 'wrongpassword',
  }, { validateStatus: () => true });

  if (wrongPassRes.status !== 401) {
    throw new Error(`Wrong password: expected 401, got ${wrongPassRes.status}`);
  }

  // Test 4: Duplicate registration returns 409
  const dupRes = await axios.post(`${BASE}/auth/register`, {
    full_name: 'TS Consumer Dup',
    phone_number: '+923001234560',
    role: 'CONSUMER',
    password: 'SecurePass123',
  }, { validateStatus: () => true });

  if (dupRes.status !== 409) {
    throw new Error(`Duplicate phone: expected 409, got ${dupRes.status}`);
  }

  // Test 5: Invalid OTP returns 401
  const otpRes = await axios.post(`${BASE}/auth/verify-otp`, {
    phone_number: '+923001234560',
    otp_code: '000000',
  }, { validateStatus: () => true });

  if (otpRes.status !== 401) {
    throw new Error(`Invalid OTP: expected 401, got ${otpRes.status}`);
  }

  // Test 6: Register with missing fields returns 400
  const badRegRes = await axios.post(`${BASE}/auth/register`, {
    phone_number: '+923001234561',
  }, { validateStatus: () => true });

  if (badRegRes.status !== 400) {
    throw new Error(`Missing fields: expected 400, got ${badRegRes.status}`);
  }

  console.log('✅ All Auth flow tests passed');
}

test().catch(e => { console.error(e.message); process.exit(1); });
