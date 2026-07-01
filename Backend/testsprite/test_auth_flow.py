import requests
import pytest

BASE = "https://luckiness-avalanche-uncombed.ngrok-free.dev/api/v1"

class TestAuthFlow:

    def test_register_new_consumer(self):
        """POST /auth/register should create a consumer account"""
        res = requests.post(f"{BASE}/auth/register", json={
            "full_name": "TS Consumer",
            "phone_number": "+923001234560",
            "role": "CONSUMER",
            "password": "SecurePass123"
        })
        # 201 created or 409 if already exists from a prior run
        assert res.status_code in [201, 409], \
            f"Expected 201 or 409, got {res.status_code}: {res.text}"

    def test_login_unverified_account_returns_403(self):
        """Unverified users must not be able to login"""
        # First register (idempotent)
        requests.post(f"{BASE}/auth/register", json={
            "full_name": "Unverified User",
            "phone_number": "+923001234561",
            "role": "CONSUMER",
            "password": "SecurePass123"
        })
        # Then try to login — must fail because OTP not verified
        res = requests.post(f"{BASE}/auth/login", json={
            "phone_number": "+923001234561",
            "password": "SecurePass123"
        })
        assert res.status_code == 403, \
            f"Expected 403 for unverified login, got {res.status_code}: {res.text}"

    def test_login_wrong_password_returns_401(self):
        """Invalid credentials must return 401"""
        res = requests.post(f"{BASE}/auth/login", json={
            "phone_number": "+923001234560",
            "password": "completelyWrongPassword99"
        })
        assert res.status_code == 401, \
            f"Expected 401 for wrong password, got {res.status_code}: {res.text}"

    def test_duplicate_phone_registration_returns_409(self):
        """Registering an already-registered phone number must return 409"""
        # Ensure the user exists first
        requests.post(f"{BASE}/auth/register", json={
            "full_name": "Original User",
            "phone_number": "+923001234562",
            "role": "CONSUMER",
            "password": "SecurePass123"
        })
        # Try to register again with same phone
        res = requests.post(f"{BASE}/auth/register", json={
            "full_name": "Duplicate User",
            "phone_number": "+923001234562",
            "role": "CONSUMER",
            "password": "SecurePass123"
        })
        assert res.status_code == 409, \
            f"Expected 409 for duplicate phone, got {res.status_code}: {res.text}"

    def test_invalid_otp_returns_401(self):
        """Submitting a wrong OTP code must return 401"""
        res = requests.post(f"{BASE}/auth/verify-otp", json={
            "phone_number": "+923001234560",
            "otp_code": "000000"
        })
        assert res.status_code == 401, \
            f"Expected 401 for wrong OTP, got {res.status_code}: {res.text}"

    def test_register_missing_fields_returns_400(self):
        """Incomplete registration payload must return 400 (validation)"""
        res = requests.post(f"{BASE}/auth/register", json={
            "phone_number": "+923001234563"
            # missing full_name, role, password
        })
        assert res.status_code == 400, \
            f"Expected 400 for missing fields, got {res.status_code}: {res.text}"

    def test_register_invalid_role_returns_400(self):
        """Using an invalid role value must return 400"""
        res = requests.post(f"{BASE}/auth/register", json={
            "full_name": "Bad Role User",
            "phone_number": "+923001234564",
            "role": "SUPERADMIN",
            "password": "SecurePass123"
        })
        assert res.status_code == 400, \
            f"Expected 400 for invalid role, got {res.status_code}: {res.text}"

    def test_resend_otp_for_nonexistent_phone_returns_401(self):
        """Resending OTP for a phone that is not registered must return 401"""
        res = requests.post(f"{BASE}/auth/resend-otp", json={
            "phone_number": "+923999999999"
        })
        assert res.status_code == 401, \
            f"Expected 401 for unknown phone resend, got {res.status_code}: {res.text}"
