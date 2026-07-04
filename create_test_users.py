import requests
import time

TARGET_URL = "https://fixit-backend-production-8e9f.up.railway.app"

def create_user(role, name, phone):
    print(f"Creating {role}...")
    res = requests.post(
        f"{TARGET_URL}/api/v1/auth/register",
        json={
            "full_name": name,
            "phone_number": phone,
            "password": "password123",
            "role": role
        }
    )
    if res.status_code == 201:
        print(f"Registered {name} ({phone})")
    elif res.status_code == 409:
        print(f"{name} ({phone}) already exists. Proceeding to verify...")
    else:
        print(f"Failed to register {name}: {res.text}")
        return

    res_verify = requests.post(
        f"{TARGET_URL}/api/v1/auth/verify-otp",
        json={
            "phone_number": phone,
            "otp_code": "000000"
        }
    )
    
    if res_verify.status_code == 201:
        print(f"Verified {name} successfully with OTP 000000!")
        print(f"Use Password: password123")
    elif res_verify.status_code == 400 and "No OTP pending" in res_verify.text:
        print(f"{name} is already verified or no OTP is pending.")
    else:
        print(f"Failed to verify {name}: {res_verify.text}")

print("Waiting a few seconds to ensure Railway backend has finished deploying the bypass...")
time.sleep(10)

print("\n--- Creating Customer ---")
create_user("CONSUMER", "Alice Customer", "+923000000001")

print("\n--- Creating Technician ---")
create_user("TECHNICIAN", "Bob Technician", "+923000000002")
