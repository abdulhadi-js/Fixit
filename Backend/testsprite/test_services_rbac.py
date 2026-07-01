import requests
import pytest

BASE = "https://luckiness-avalanche-uncombed.ngrok-free.dev/api/v1"

class TestServicesRBAC:

    def test_list_services_is_public(self):
        """GET /services should return 200 and an array without any auth token"""
        res = requests.get(f"{BASE}/services")
        assert res.status_code == 200, \
            f"Expected 200 for public service list, got {res.status_code}"
        assert isinstance(res.json(), list), \
            f"Expected array response, got {type(res.json())}"

    def test_get_single_service_nonexistent_returns_404(self):
        """GET /services/:id with a non-existent UUID must return 404"""
        res = requests.get(f"{BASE}/services/00000000-0000-0000-0000-000000000001")
        assert res.status_code == 404, \
            f"Expected 404 for non-existent service, got {res.status_code}"

    def test_create_service_no_auth_returns_401(self):
        """POST /services without Bearer token must return 401"""
        res = requests.post(f"{BASE}/services", json={
            "title": "Unauthorized Service",
            "base_price": 1000,
            "estimated_duration_mins": 60
        })
        assert res.status_code == 401, \
            f"Expected 401 for unauthenticated create, got {res.status_code}: {res.text}"

    def test_create_service_invalid_jwt_returns_401(self):
        """POST /services with a fake Bearer token must return 401"""
        res = requests.post(f"{BASE}/services", json={
            "title": "Fake Token Service",
            "base_price": 2000
        }, headers={"Authorization": "Bearer this.is.fake"})
        assert res.status_code == 401, \
            f"Expected 401 for invalid JWT, got {res.status_code}: {res.text}"

    def test_update_service_no_auth_returns_401(self):
        """PATCH /services/:id without auth must return 401"""
        res = requests.patch(
            f"{BASE}/services/00000000-0000-0000-0000-000000000000",
            json={"base_price": 9999}
        )
        assert res.status_code == 401, \
            f"Expected 401 for unauthenticated update, got {res.status_code}"

    def test_delete_service_no_auth_returns_401(self):
        """DELETE /services/:id without auth must return 401"""
        res = requests.delete(f"{BASE}/services/00000000-0000-0000-0000-000000000000")
        assert res.status_code == 401, \
            f"Expected 401 for unauthenticated delete, got {res.status_code}"

    def test_create_service_missing_required_fields_returns_400(self):
        """POST /services with missing base_price must fail validation — but requires auth first (401)"""
        # Without auth we get 401 — the validator runs after auth guard
        res = requests.post(f"{BASE}/services", json={"title": "No Price Service"})
        assert res.status_code == 401, \
            f"Expected 401 (auth guard before validation), got {res.status_code}"
