import requests
import pytest

BASE = "https://luckiness-avalanche-uncombed.ngrok-free.dev/api/v1"

class TestSeededServices:

    def test_services_catalog_returns_seeded_data(self):
        """GET /services should return at least 25 seeded categories"""
        res = requests.get(f"{BASE}/services")
        assert res.status_code == 200, f"Expected 200, got {res.status_code}"
        
        services = res.json()
        assert isinstance(services, list), "Expected a list of services"
        assert len(services) >= 25, f"Expected at least 25 services, found {len(services)}"

        # Check for specific seeded categories
        titles = [s['title'] for s in services]
        assert "Electrical Wiring & Rewiring" in titles, "Missing Electrical category"
        assert "Pipe Leakage Repair" in titles, "Missing Plumbing category"
        assert "AC Gas Refilling" in titles, "Missing AC category"
        assert "Washing Machine Repair" in titles, "Missing Appliance category"
        
        # Verify metadata shape
        electrical = next((s for s in services if s['title'] == "Electrical Wiring & Rewiring"), None)
        assert electrical is not None
        assert electrical['base_price'] == 3500
        assert electrical['estimated_duration_mins'] == 120
        assert electrical['metadata']['icon'] == 'electrical'
        assert electrical['metadata']['requires_parts'] is True
