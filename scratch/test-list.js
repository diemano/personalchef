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

    // 1. Fetch all (no status param)
    const res1 = await fetch(`${API_BASE}/pratos-cardapio`, {
      headers: { 'authorization': `Bearer ${token}` }
    });
    const data1 = await res1.json();
    const items1 = data1.data || data1;
    console.log('Without status param:', Array.isArray(items1) ? `${items1.length} items` : 'not array');
    if (Array.isArray(items1)) {
      items1.forEach(item => {
        console.log(`- ${item.nome || item.name} | status: ${item.status}`);
      });
    }

    // 2. Fetch active only
    const res2 = await fetch(`${API_BASE}/pratos-cardapio?status=true`, {
      headers: { 'authorization': `Bearer ${token}` }
    });
    const data2 = await res2.json();
    const items2 = data2.data || data2;
    console.log('\nWith status=true:', Array.isArray(items2) ? `${items2.length} items` : 'not array');

    // 3. Fetch inactive only
    const res3 = await fetch(`${API_BASE}/pratos-cardapio?status=false`, {
      headers: { 'authorization': `Bearer ${token}` }
    });
    const data3 = await res3.json();
    const items3 = data3.data || data3;
    console.log('\nWith status=false:', Array.isArray(items3) ? `${items3.length} items` : 'not array');
    if (Array.isArray(items3)) {
      items3.forEach(item => {
        console.log(`- ${item.nome || item.name} | status: ${item.status}`);
      });
    }

  } catch (err) {
    console.error('Error:', err);
  }
}

run();
