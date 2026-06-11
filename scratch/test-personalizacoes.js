process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const API_BASE = 'https://chefdesk-api-963913766778.us-central1.run.app';

async function run() {
  try {
    // 1. Login
    console.log('Logging in...');
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        emailOrUsername: 'admin',
        password: 'admin123456'
      })
    });

    if (!loginRes.ok) {
      console.error('Login failed:', loginRes.status, await loginRes.text());
      return;
    }

    const loginData = await loginRes.json();
    const token = loginData.access_token;
    console.log('Login successful. Token acquired.');

    // 2. Get personalizations
    const getRes = await fetch(`${API_BASE}/personalizacoes-servico`, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    });

    console.log('GET /personalizacoes-servico status:', getRes.status);
    const getResult = await getRes.json();
    console.log('Current data:', getResult);

    const items = getResult.data || getResult;
    if (Array.isArray(items) && items.length === 0) {
      console.log('No personalizations found. Seeding defaults...');
      
      const defaults = [
        {
          nome: 'Mudar proteína',
          descricao: 'Eleve o prato principal com uma proteína premium alinhada ao menu escolhido.',
          valorEvento: 20.0,
          status: true
        },
        {
          nome: 'Prato duplicado',
          descricao: 'Inclua uma segunda opção em uma categoria do menu para ampliar a escolha dos convidados.',
          valorEvento: 30.0,
          status: true
        },
        {
          nome: 'Tempo adicional',
          descricao: 'Estenda a presença da equipe para eventos com ritmo mais longo ou recepção prolongada.',
          valorEvento: 50.0,
          status: true
        },
        {
          nome: 'Decoração',
          descricao: 'Decoração completa para a mesa dos convidados e mesa de doces.',
          valorEvento: 250.0,
          status: true
        }
      ];

      for (const item of defaults) {
        const createRes = await fetch(`${API_BASE}/personalizacoes-servico`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'authorization': `Bearer ${token}`
          },
          body: JSON.stringify(item)
        });
        console.log(`Created ${item.nome}:`, createRes.status, await createRes.json());
      }
      
      // Fetch again to verify
      const verifyRes = await fetch(`${API_BASE}/personalizacoes-servico`, {
        headers: { 'authorization': `Bearer ${token}` }
      });
      console.log('After seed:', await verifyRes.json());
    } else {
      console.log('Personalizations already seeded or not an empty array.');
    }
  } catch (err) {
    console.error('Error during test:', err);
  }
}

run();
