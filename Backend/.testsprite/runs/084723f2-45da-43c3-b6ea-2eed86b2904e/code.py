# Auto-injected credentials — do not modify
__AUTH_CREDENTIAL__ = ""
__AUTH_TYPE__ = "public"
__AUTH_HEADERS__ = {}
import json
import requests

def test_booking_and_stripe_lifecycle():
    # Testing POST https://luckiness-avalanche-uncombed.ngrok-free.dev/bookings — booking creation successfully integrates with Stripe and returns a payment intent client secret

    # build
    base = "https://luckiness-avalanche-uncombed.ngrok-free.dev"
    headers = {"Content-Type": "application/json", **__AUTH_HEADERS__}

    consumer_phone = "+923001234567"
    consumer_register = requests.post(
        f"{base}/auth/register",
        headers=headers,
        json={
            "full_name": "Test Consumer",
            "phone_number": consumer_phone,
            "password": "Password123",
            "role": "consumer",
        },
        timeout=30,
    )
    consumer_login = requests.post(
        f"{base}/auth/login",
        headers=headers,
        json={
            "phone_number": consumer_phone,
            "password": "Password123",
        },
        timeout=30,
    )
    consumer_login_data = consumer_login.json()
    consumer_token = consumer_login_data.get("access_token")

    tech_phone = "+923109876543"
    tech_register = requests.post(
        f"{base}/auth/register",
        headers=headers,
        json={
            "full_name": "Test Tech",
            "phone_number": tech_phone,
            "password": "Password123",
            "role": "technician",
        },
        timeout=30,
    )
    tech_login = requests.post(
        f"{base}/auth/login",
        headers=headers,
        json={
            "phone_number": tech_phone,
            "password": "Password123",
        },
        timeout=30,
    )
    tech_login_data = tech_login.json()
    tech_token = tech_login_data.get("access_token")

    tech_me = requests.get(
        f"{base}/auth/me",
        headers={"Content-Type": "application/json", **__AUTH_HEADERS__, "Authorization": f"Bearer {tech_token}"},
        timeout=30,
    )
    tech_me_data = tech_me.json()
    tech_id = tech_me_data.get("id")

    services_res = requests.get(f"{base}/services", headers=headers, timeout=30)
    services_data = services_res.json()
    service_id = services_data[0]["id"]

    # call
    booking_res = requests.post(
        f"{base}/bookings",
        headers={"Content-Type": "application/json", **__AUTH_HEADERS__, "Authorization": f"Bearer {consumer_token}"},
        json={
            "service_id": service_id,
            "technician_id": tech_id,
            "scheduled_start": "2026-07-15T10:00:00Z",
            "address_details": "123 Test St",
        },
        timeout=30,
    )

    print(booking_res.status_code)
    print(booking_res.text)

    # assert
    assert booking_res.status_code == 201, f"Expected 201 Created, got {booking_res.status_code}: {booking_res.text}"

    try:
        data = booking_res.json()
    except json.JSONDecodeError as exc:
        raise AssertionError(f"Expected JSON response with booking and client_secret, got invalid JSON: {booking_res.text}") from exc

    assert isinstance(data, dict), f"Expected a JSON object response, got {type(data).__name__}: {data!r}"

    client_secret = data.get("client_secret")
    booking = data.get("booking")

    assert isinstance(client_secret, str) and client_secret, f"Expected non-empty client_secret string, got {client_secret!r}"
    assert isinstance(booking, dict), f"Expected booking object in response, got {booking!r}"
    assert "status" in booking and isinstance(booking["status"], str), f"Expected booking.status as string, got {booking.get('status')!r}"
    assert "consumer_id" in booking, f"Expected booking.consumer_id to exist, got keys: {list(booking.keys())}"
    assert "technician_id" in booking, f"Expected booking.technician_id to exist, got keys: {list(booking.keys())}"

test_booking_and_stripe_lifecycle()