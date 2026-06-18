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

    // 1. Get all dishes to find a test candidate
    const listRes = await fetch(`${API_BASE}/pratos-cardapio`, {
      headers: { 'authorization': `Bearer ${token}` }
    });
    const listData = await listRes.json();
    const dishes = listData.data || listData;

    const testDish = dishes.find(d => (d.nome || d.name).includes('Prato Teste'));
    if (!testDish) {
      console.log('No test dish found to deactivate.');
      return;
    }

    const dishId = testDish.id || testDish._id;
    console.log(`Using dish: "${testDish.nome || testDish.name}" with ID: ${dishId}`);
    console.log('Current status:', testDish.status);

    // 2. Set status to false (PATCH)
    console.log('Updating status to false...');
    const updateRes = await fetch(`${API_BASE}/pratos-cardapio/${dishId}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status: false })
    });

    console.log('Update PATCH status code:', updateRes.status);
    const updateBody = await updateRes.json();
    console.log('Update PATCH response body status:', updateBody.status);

    // 3. Get individual dish (GET /pratos-cardapio/:id)
    const getRes = await fetch(`${API_BASE}/pratos-cardapio/${dishId}`, {
      headers: { 'authorization': `Bearer ${token}` }
    });
    const getBody = await getRes.json();
    console.log('\nDirect GET dish status:', getBody.status);

    // 4. Get all dishes again (GET /pratos-cardapio)
    const listRes2 = await fetch(`${API_BASE}/pratos-cardapio`, {
      headers: { 'authorization': `Bearer ${token}` }
    });
    const listData2 = await listRes2.json();
    const dishes2 = listData2.data || listData2;
    const foundInList = dishes2.find(d => (d.id || d._id) === dishId);

    if (foundInList) {
      console.log(`\nFound in list! Status in list: ${foundInList.status}`);
    } else {
      console.log('\nNOT found in list! It disappeared from the GET /pratos-cardapio response!');
    }

    // 5. Restore status to true (clean up)
    console.log('\nRestoring status to true for cleanup...');
    await fetch(`${API_BASE}/pratos-cardapio/${dishId}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status: true })
    });

  } catch (err) {
    console.error('Error:', err);
  }
}

run();
