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

# Try POST to /leads
lead_payload = {
    "name": "Test Direct Lead",
    "phone": "83912345678",
    "lgpdConsent": True,
    "source": "web"
}

req_post = urllib.request.Request(
    f'{base_url}/leads',
    data=json.dumps(lead_payload).encode('utf-8'),
    headers={
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {token}'
    },
    method='POST'
)

try:
    with urllib.request.urlopen(req_post, context=ctx) as res:
        res_data = json.loads(res.read().decode('utf-8'))
        print('POST /leads SUCCESS:', res_data)
except Exception as e:
    print('POST /leads FAILED:', e)
