import requests
import time

TARGET_URL = "https://fixit-backend-production-8e9f.up.railway.app"

def test_auth_flow():
    # 1. Register a new user
    phone = f"+92300{int(time.time())}"[-13:]
    res = requests.post(
        f"{TARGET_URL}/api/v1/auth/register",
        json={
            "full_name": "Test User",
            "phone_number": phone,
            "password": "testpassword123",
            "role": "CONSUMER"
        }
    )
    assert res.status_code == 201, f"Register failed: {res.text}"

    # 2. Login (should fail because not verified)
    res = requests.post(
        f"{TARGET_URL}/api/v1/auth/login",
        json={
            "phone_number": phone,
            "password": "testpassword123"
        }
    )
    assert res.status_code == 403, f"Expected 403 Forbidden since not verified, got: {res.status_code} {res.text}"

test_auth_flow()
