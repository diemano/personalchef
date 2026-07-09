import urllib.request
import json
import ssl

base_url = 'https://chefdesk-api-963913766778.us-central1.run.app'
ctx = ssl._create_unverified_context()

# Login
login_payload = json.dumps({'emailOrUsername': 'admin', 'password': 'admin123456'}).encode('utf-8')
req_login = urllib.request.Request(f'{base_url}/auth/login', data=login_payload, headers={'Content-Type': 'application/json'}, method='POST')
try:
    with urllib.request.urlopen(req_login, context=ctx) as res:
        login_res = json.loads(res.read().decode('utf-8'))
        token = login_res.get('access_token')
except Exception as e:
    print('Login failed:', e)
    exit()

# Try PATCH to /leads/6a4fd7290d92c200f5706d4f
lead_id = '6a4fd7290d92c200f5706d4f'
patch_payload = {
    "status": "em_atendimento",
    "email": "test@lead.com",
    "notes": "Custom notes for lead",
    "dietaryRestrictions": ["vegetariano", "zero-lactose"]
}

req_patch = urllib.request.Request(
    f'{base_url}/leads/{lead_id}',
    data=json.dumps(patch_payload).encode('utf-8'),
    headers={
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {token}'
    },
    method='PATCH'
)

try:
    with urllib.request.urlopen(req_patch, context=ctx) as res:
        res_data = json.loads(res.read().decode('utf-8'))
        print('PATCH /leads SUCCESS:', res_data)
except Exception as e:
    print('PATCH /leads FAILED:', e)

# Fetch it again
req_get = urllib.request.Request(
    f'{base_url}/leads/{lead_id}',
    headers={
        'Authorization': f'Bearer {token}'
    },
    method='GET'
)
try:
    with urllib.request.urlopen(req_get, context=ctx) as res:
        res_data = json.loads(res.read().decode('utf-8'))
        print('GET /leads/:id SUCCESS:', res_data)
except Exception as e:
    print('GET /leads/:id FAILED:', e)
