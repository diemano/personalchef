const API_BASE = 'https://chefdesk-api-963913766778.us-central1.run.app';

async function run() {
  try {
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ emailOrUsername: 'admin', password: 'admin123456' })
    });
    const loginData = await loginRes.json();
    const token = loginData.access_token;

    // 1. Get a test dish ID
    const listRes = await fetch(`${API_BASE}/pratos-cardapio`, {
      headers: { 'authorization': `Bearer ${token}` }
    });
    const listData = await listRes.json();
    const dishes = listData.data || listData;
    const testDish = dishes.find(d => (d.nome || d.name).includes('Prato Teste'));
    if (!testDish) return;
    const dishId = testDish.id || testDish._id;

    // 2. Set to inactive
    await fetch(`${API_BASE}/pratos-cardapio/${dishId}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json', 'authorization': `Bearer ${token}` },
      body: JSON.stringify({ status: false })
    });

    // 3. Test different query parameters to see if the inactive dish is returned
    const paramsToTest = [
      'status=all',
      'status=any',
      'status=inactive',
      'status=false',
      'all=true',
      'includeInactive=true',
      'showInactive=true',
      'active=false',
      'active=all',
      'ativo=false',
      'status=0',
      'status=null'
    ];

    for (const param of paramsToTest) {
      const url = `${API_BASE}/pratos-cardapio?${param}`;
      const res = await fetch(url, {
        headers: { 'authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      const items = data.data || data;
      const found = items.find(d => (d.id || d._id) === dishId);
      console.log(`Querying "${param}": Found inactive dish? ${found ? 'YES (status: ' + found.status + ')' : 'NO'} | Total items: ${items.length}`);
    }

    // 4. Cleanup
    await fetch(`${API_BASE}/pratos-cardapio/${dishId}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json', 'authorization': `Bearer ${token}` },
      body: JSON.stringify({ status: true })
    });

  } catch (err) {
    console.error('Error:', err);
  }
}

run();
