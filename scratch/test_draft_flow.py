import urllib.request
import json
import ssl

base_url = 'https://chefdesk-api-963913766778.us-central1.run.app'
ctx = ssl._create_unverified_context()

# 1. POST to /orcamento-drafts to create a draft
draft_payload = {
    "currentStep": 3,
    "totalScreens": 20,
    "isNextEnabled": True,
    "data": {
        "cliente": {
            "nome": "Test Draft Client",
            "whatsapp": "83987654321"
        },
        "dataEvento": "2026-08-15T20:00:00.000Z",
        "turno": "dinner",
        "cidade": "Cabedelo",
        "bairro": "Intermares",
        "tipoLocal": "apartment",
        "qtdPessoas": 12,
        "ocasiao": "Jantar Especial",
        "estruturaCozinha": ["fogão"],
        "restricoesAlimentares": {
            "possuiRestricoes": False,
            "itens": [],
            "observacoes": ""
        },
        "menu": {},
        "personalizacaoServico": {
            "temDecoracao": False,
            "qtdGarcons": 1,
            "custoGarcons": 120,
            "mudouProteina": False,
            "duplicarPrato": False,
            "tempoAdicional": False
        },
        "valorEstimadoTotal": 2640,
        "baseCost": 2640,
        "extrasCost": 0,
        "pricingBreakdown": [],
        "status": "novo",
        "origem": "site"
    }
}

req_post = urllib.request.Request(
    f'{base_url}/orcamento-drafts',
    data=json.dumps(draft_payload).encode('utf-8'),
    headers={'Content-Type': 'application/json'},
    method='POST'
)

draft_id = None
try:
    with urllib.request.urlopen(req_post, context=ctx) as res:
        res_data = json.loads(res.read().decode('utf-8'))
        print('POST /orcamento-drafts response:', res_data)
        # Try to find ID
        draft_id = res_data.get('id') or res_data.get('_id')
        if not draft_id and 'data' in res_data:
            draft_id = res_data['data'].get('id') or res_data['data'].get('_id')
        print('Created Draft ID:', draft_id)
except Exception as e:
    print('Failed to create draft:', e)

if not draft_id:
    exit()

# Login as admin to test GET endpoints
login_payload = json.dumps({'emailOrUsername': 'admin', 'password': 'admin123456'}).encode('utf-8')
req_login = urllib.request.Request(f'{base_url}/auth/login', data=login_payload, headers={'Content-Type': 'application/json'}, method='POST')
try:
    with urllib.request.urlopen(req_login, context=ctx) as res:
        login_res = json.loads(res.read().decode('utf-8'))
        token = login_res.get('access_token')
except Exception as e:
    print('Login failed:', e)
    exit()

# Try GET /orcamento-drafts/<id>
req_get_draft = urllib.request.Request(
    f'{base_url}/orcamento-drafts/{draft_id}',
    headers={'Authorization': f'Bearer {token}'},
    method='GET'
)
try:
    with urllib.request.urlopen(req_get_draft, context=ctx) as res:
        draft_get = json.loads(res.read().decode('utf-8'))
        print('GET /orcamento-drafts/<id> SUCCESS:', draft_get)
except Exception as e:
    print('GET /orcamento-drafts/<id> FAILED:', e)

# Try GET /leads to see if "Test Draft Client" is listed as a lead!
req_leads = urllib.request.Request(
    f'{base_url}/leads',
    headers={'Authorization': f'Bearer {token}'},
    method='GET'
)
try:
    with urllib.request.urlopen(req_leads, context=ctx) as res:
        leads_list = json.loads(res.read().decode('utf-8'))
        print('Leads list names:', [lead.get('name') for lead in leads_list])
except Exception as e:
    print('GET /leads FAILED:', e)
