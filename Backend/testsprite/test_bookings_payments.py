import requests
import pytest

BASE = "https://luckiness-avalanche-uncombed.ngrok-free.dev/api/v1"

class TestBookingsAndPaymentsAuth:

    def test_create_booking_no_auth_returns_401(self):
        """POST /bookings without JWT must return 401"""
        res = requests.post(f"{BASE}/bookings", json={
            "service_id": "00000000-0000-0000-0000-000000000000",
            "technician_id": "00000000-0000-0000-0000-000000000000",
            "scheduled_start": "2026-08-01T10:00:00Z",
            "address_details": {"area": "DHA", "street": "St 1", "house": "H1"}
        })
        assert res.status_code == 401, \
            f"Expected 401, got {res.status_code}: {res.text}"

    def test_get_availability_no_auth_returns_401(self):
        """GET /bookings/availability without JWT must return 401"""
        res = requests.get(
            f"{BASE}/bookings/availability",
            params={"service_id": "test", "scheduled_start": "2026-08-01T10:00:00Z"}
        )
        assert res.status_code == 401, \
            f"Expected 401, got {res.status_code}"

    def test_get_my_bookings_no_auth_returns_401(self):
        """GET /bookings/my without JWT must return 401"""
        res = requests.get(f"{BASE}/bookings/my")
        assert res.status_code == 401, \
            f"Expected 401, got {res.status_code}"

    def test_get_agenda_no_auth_returns_401(self):
        """GET /bookings/agenda without JWT must return 401"""
        res = requests.get(f"{BASE}/bookings/agenda")
        assert res.status_code == 401, \
            f"Expected 401, got {res.status_code}"

    def test_update_booking_status_no_auth_returns_401(self):
        """PATCH /bookings/:id/status without JWT must return 401"""
        res = requests.patch(
            f"{BASE}/bookings/00000000-0000-0000-0000-000000000000/status",
            json={"status": "IN_PROGRESS"}
        )
        assert res.status_code == 401, \
            f"Expected 401, got {res.status_code}"

    def test_cancel_booking_no_auth_returns_401(self):
        """DELETE /bookings/:id without JWT must return 401"""
        res = requests.delete(f"{BASE}/bookings/00000000-0000-0000-0000-000000000000")
        assert res.status_code == 401, \
            f"Expected 401, got {res.status_code}"

    def test_get_earnings_no_auth_returns_401(self):
        """GET /payments/earnings without JWT must return 401"""
        res = requests.get(f"{BASE}/payments/earnings")
        assert res.status_code == 401, \
            f"Expected 401, got {res.status_code}"

    def test_get_transactions_no_auth_returns_401(self):
        """GET /payments/transactions/my without JWT must return 401"""
        res = requests.get(f"{BASE}/payments/transactions/my")
        assert res.status_code == 401, \
            f"Expected 401, got {res.status_code}"

    def test_create_booking_fake_jwt_returns_401(self):
        """POST /bookings with invalid Bearer token must return 401"""
        res = requests.post(f"{BASE}/bookings", json={
            "service_id": "00000000-0000-0000-0000-000000000000",
            "technician_id": "00000000-0000-0000-0000-000000000000",
            "scheduled_start": "2026-08-01T10:00:00Z",
            "address_details": {"area": "DHA", "street": "St 1", "house": "H1"}
        }, headers={"Authorization": "Bearer fake.jwt.token"})
        assert res.status_code == 401, \
            f"Expected 401 for fake JWT, got {res.status_code}: {res.text}"
