import requests
import time

BASE = "https://luckiness-avalanche-uncombed.ngrok-free.dev/api/v1"

def login(phone):
    res = requests.post(f"{BASE}/auth/login", json={
        "phone_number": phone,
        "password": "SecurePass123"
    })
    return res.json().get("access_token")

class TestBookingLifecycle:
    def test_create_booking_creates_payment_intent(self):
        # 1. Login with pre-seeded Consumer
        consumer_phone = "+923000000001"
        c_token = login(consumer_phone)
        assert c_token is not None, "Failed to login consumer"

        # 2. Login with pre-seeded Technician
        tech_phone = "+923100000002"
        t_token = login(tech_phone)
        assert t_token is not None, "Failed to login technician"
        
        # Get technician ID
        res = requests.get(f"{BASE}/auth/me", headers={"Authorization": f"Bearer {t_token}"})
        tech_id = res.json()["id"]

        # 3. Get a valid service category
        res = requests.get(f"{BASE}/services")
        services = res.json()
        assert len(services) > 0, "No services seeded"
        service_id = services[0]["id"]

        # 4. Create Booking
        # We add some randomness to the scheduled_start so we don't hit the GiST exclusion constraint on repeated runs
        future_day = int(time.time() % 28) + 1
        start_time = f"2026-08-{future_day:02d}T10:00:00Z"
        
        res = requests.post(f"{BASE}/bookings", headers={"Authorization": f"Bearer {c_token}"}, json={
            "service_id": service_id,
            "technician_id": tech_id,
            "scheduled_start": start_time,
            "address_details": {"street": "123 Test St", "city": "Test City"}
        })
        
        assert res.status_code == 201, f"Expected 201, got {res.status_code} - {res.text}"
        data = res.json()
        
        # Verify Payment Intent was created
        assert "client_secret" in data, "No client_secret returned from Stripe"
        assert data["client_secret"].startswith("pi_"), "Invalid client_secret format"
        
        booking = data["booking"]
        assert booking["status"] == "PENDING_PAYMENT"
        assert booking["consumer_id"] is not None
        assert booking["technician_id"] == tech_id
        
        print("✅ Booking successfully created with client_secret:", data["client_secret"])

if __name__ == "__main__":
    test = TestBookingLifecycle()
    test.test_create_booking_creates_payment_intent()
