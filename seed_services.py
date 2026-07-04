import requests
import time

TARGET_URL = "https://fixit-backend-production-8e9f.up.railway.app"

def create_admin():
    phone = "+923000000999"
    print(f"Creating ADMIN...")
    res = requests.post(
        f"{TARGET_URL}/api/v1/auth/register",
        json={
            "full_name": "Admin User",
            "phone_number": phone,
            "password": "password123",
            "role": "ADMIN"
        }
    )
    
    requests.post(
        f"{TARGET_URL}/api/v1/auth/verify-otp",
        json={"phone_number": phone, "otp_code": "000000"}
    )
    
    # Login to get token
    login_res = requests.post(
        f"{TARGET_URL}/api/v1/auth/login",
        json={"phone_number": phone, "password": "password123"}
    )
    token = login_res.json().get('access_token')
    return token

SERVICES = [
    {
        "title": "Deep Home Cleaning",
        "base_price": 4500,
        "estimated_duration_mins": 240,
        "metadata": {
            "category": "Cleaning",
            "description": "A thorough top-to-bottom cleaning of your home, including carpets, windows, and deep sanitization of all bathrooms and kitchens."
        }
    },
    {
        "title": "Smart Home Installation",
        "base_price": 3000,
        "estimated_duration_mins": 90,
        "metadata": {
            "category": "Electrical",
            "description": "Professional installation and setup of smart home devices including thermostats, smart locks, cameras, and hubs."
        }
    },
    {
        "title": "Emergency Leak Repair",
        "base_price": 2500,
        "estimated_duration_mins": 60,
        "metadata": {
            "category": "Plumbing",
            "description": "Fast response to fix urgent pipe leaks, burst pipes, and water damage prevention."
        }
    },
    {
        "title": "AC Master Servicing",
        "base_price": 2000,
        "estimated_duration_mins": 120,
        "metadata": {
            "category": "HVAC",
            "description": "Complete breakdown and chemical wash of split or window AC units, ensuring optimal cooling and air quality."
        }
    },
    {
        "title": "Wall Painting & Decor",
        "base_price": 6000,
        "estimated_duration_mins": 360,
        "metadata": {
            "category": "Maintenance",
            "description": "Premium interior wall painting with color consultation and meticulous edge-work. Includes surface prep."
        }
    },
    {
        "title": "Custom Furniture Assembly",
        "base_price": 1500,
        "estimated_duration_mins": 90,
        "metadata": {
            "category": "Maintenance",
            "description": "Expert assembly of flat-pack furniture, from simple chairs to complex wardrobe systems."
        }
    }
]

token = create_admin()
if not token:
    print("Failed to get admin token.")
    exit(1)

print("Admin token acquired. Adding services...")
headers = {"Authorization": f"Bearer {token}"}

for s in SERVICES:
    res = requests.post(
        f"{TARGET_URL}/api/v1/services",
        json=s,
        headers=headers
    )
    if res.status_code == 201:
        print(f"Added: {s['title']}")
    elif res.status_code == 409:
        print(f"Already exists: {s['title']}")
    else:
        print(f"Failed to add {s['title']}: {res.text}")

