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

    // 2. Get current /options pricing
    const optionsResBefore = await fetch(`${API_BASE}/options`);
    const optionsBefore = await optionsResBefore.json();
    console.log('Options pricing before:', optionsBefore[0].pricing);

    // 3. Find the "Mudar proteína" personalization
    const getRes = await fetch(`${API_BASE}/personalizacoes-servico`, {
      headers: { 'authorization': `Bearer ${token}` }
    });
    const { data: items } = await getRes.json();
    const proteinUpgrade = items.find(item => item.nome === 'Mudar proteína');

    if (!proteinUpgrade) {
      console.log('Could not find Mudar proteína personalization.');
      return;
    }

    // 4. Update the price of "Mudar proteína" to 22.5
    console.log(`Updating ${proteinUpgrade.nome} price to 22.5...`);
    const updateRes = await fetch(`${API_BASE}/personalizacoes-servico/${proteinUpgrade.id}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        valorEvento: 22.5
      })
    });
    console.log('Update status:', updateRes.status, await updateRes.json());

    // 5. Fetch /options pricing again
    const optionsResAfter = await fetch(`${API_BASE}/options`);
    const optionsAfter = await optionsResAfter.json();
    console.log('Options pricing after update:', optionsAfter[0].pricing);

    // 6. Revert back to 20.0
    console.log('Restoring price to 20.0...');
    await fetch(`${API_BASE}/personalizacoes-servico/${proteinUpgrade.id}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        valorEvento: 20.0
      })
    });

  } catch (err) {
    console.error('Error in sync test:', err);
  }
}

run();
