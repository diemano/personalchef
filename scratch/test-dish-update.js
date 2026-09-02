process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const API_BASE = 'https://chefdesk-api-963913766778.us-central1.run.app';

async function run() {
  // Login
  const loginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ emailOrUsername: 'admin', password: 'admin123456' })
  });
  const loginData = await loginRes.json();
  const token = loginData.access_token;
  const auth = { 'content-type': 'application/json', authorization: `Bearer ${token}` };

  // 1. Create a temp dish using the exact shape the frontend sends on create
  const createPayload = {
    name: 'Prato Teste Edição JS',
    nome: 'Prato Teste Edição JS',
    slug: 'prato-teste-edicao-js',
    description: 'Descrição de teste',
    descricao: 'Descrição de teste',
    categoria: 'dessert',
    perfilAlimentar: [],
    estilo: [],
    imagem: '',
    custoAdicional: 0,
    pratoDestaque: false,
    status: true
  };
  const createRes = await fetch(`${API_BASE}/pratos-cardapio`, {
    method: 'POST',
    headers: auth,
    body: JSON.stringify(createPayload)
  });
  const createBody = await createRes.text();
  console.log('CREATE status:', createRes.status);
  console.log('CREATE body:', createBody.slice(0, 800));
  if (!createRes.ok) return;

  const tempDish = JSON.parse(createBody);
  const id = tempDish.id || tempDish._id;
  console.log('Temp dish id:', id);

  // 2. PATCH with the exact shape the frontend sends on update
  const patchPayload = {
    name: 'Prato Teste Edição JS 2',
    nome: 'Prato Teste Edição JS 2',
    description: 'Descrição alterada',
    descricao: 'Descrição alterada',
    categoria: 'dessert',
    perfilAlimentar: ['vegano'],
    estilo: ['fusion'],
    imagem: '',
    custoAdicional: 0,
    pratoDestaque: true,
    status: true
  };
  const patchRes = await fetch(`${API_BASE}/pratos-cardapio/${id}`, {
    method: 'PATCH',
    headers: auth,
    body: JSON.stringify(patchPayload)
  });
  const patchBody = await patchRes.text();
  console.log('PATCH status:', patchRes.status);
  console.log('PATCH body:', patchBody.slice(0, 800));

  // 3. Cleanup
  const delRes = await fetch(`${API_BASE}/pratos-cardapio/${id}`, {
    method: 'DELETE',
    headers: auth
  });
  console.log('DELETE status:', delRes.status, await delRes.text());
}

run().catch((e) => console.error('Error:', e));
