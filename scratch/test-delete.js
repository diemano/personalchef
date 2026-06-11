process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const API_BASE = 'https://chefdesk-api-963913766778.us-central1.run.app';

async function run() {
  try {
    // 1. Login
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ emailOrUsername: 'admin', password: 'admin123456' })
    });
    const loginData = await loginRes.json();
    const token = loginData.access_token;

    // 2. Fetch dishes
    const dishesRes = await fetch(`${API_BASE}/pratos-cardapio`, {
      headers: { 'authorization': `Bearer ${token}` }
    });
    const dishes = await dishesRes.json();
    const items = dishes.data || dishes;

    if (!Array.isArray(items) || items.length === 0) {
      console.log('No dishes found.');
      return;
    }

    // Try to find a dish that we can test delete on (e.g. one we created or a sample one)
    // Let's create a temporary dish first, then try to delete it!
    console.log('Creating a temp dish...');
    const createRes = await fetch(`${API_BASE}/pratos-cardapio`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        nome: 'Prato de Teste Exclusão',
        slug: 'prato-teste-exclusao',
        categoria: 'dessert',
        descricao: 'Descrição de teste',
        perfilAlimentar: [],
        estilo: [],
        imagem: '',
        custoAdicional: 0,
        pratoDestaque: false,
        status: true
      })
    });

    if (!createRes.ok) {
      console.error('Failed to create temp dish:', createRes.status, await createRes.text());
      return;
    }

    const tempDish = await createRes.json();
    console.log('Created temp dish with ID:', tempDish.id);

    // Now try to delete it!
    console.log(`Sending DELETE /pratos-cardapio/${tempDish.id}...`);
    const deleteRes = await fetch(`${API_BASE}/pratos-cardapio/${tempDish.id}`, {
      method: 'DELETE',
      headers: {
        'authorization': `Bearer ${token}`
      }
    });

    console.log('DELETE status:', deleteRes.status);
    console.log('DELETE body:', await deleteRes.text());

  } catch (err) {
    console.error('Error during test:', err);
  }
}

run();
