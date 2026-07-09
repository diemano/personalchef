import urllib.request
import json
import ssl
import urllib.error

base_url = 'https://chefdesk-api-963913766778.us-central1.run.app'
ctx = ssl._create_unverified_context()

# Login
login_payload = json.dumps({'emailOrUsername': 'admin', 'password': 'admin123456'}).encode('utf-8')
req = urllib.request.Request(f'{base_url}/auth/login', data=login_payload, headers={'Content-Type': 'application/json'}, method='POST')

try:
    with urllib.request.urlopen(req, context=ctx) as res:
        login_res = json.loads(res.read().decode('utf-8'))
        token = login_res.get('access_token')
except Exception as e:
    print('Login failed:', e)
    exit()

def get_error_body(url):
    req_ep = urllib.request.Request(url, headers={'Authorization': f'Bearer {token}'}, method='GET')
    try:
        with urllib.request.urlopen(req_ep, context=ctx) as res_ep:
            print(url, 'SUCCESS:', res_ep.read().decode('utf-8')[:500])
    except urllib.error.HTTPError as e:
        print(f'{url}: {e.code} - {e.read().decode("utf-8")}')
    except Exception as e:
        print(f'{url}: {e}')

get_error_body(f'{base_url}/orcamento-drafts/all')
get_error_body(f'{base_url}/orcamento-drafts/list')
get_error_body(f'{base_url}/orcamentos/drafts')
