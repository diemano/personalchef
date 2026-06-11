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

    // 2. Fetch options to get id
    const getRes = await fetch(`${API_BASE}/options`);
    const options = await getRes.json();
    const item = Array.isArray(options) ? options[0] : options;
    const id = item._id || item.id;
    console.log('Options ID:', id);

    // 3. Test PATCH options with the updated pricing
    const newPricing = {
      ...item.pricing,
      proteinUpgradePer: 25 // Change from 20 to 25
    };

    console.log('PATCHing /options with new pricing...');
    const patchRes = await fetch(`${API_BASE}/options/${id}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        pricing: newPricing
      })
    });

    console.log('PATCH status:', patchRes.status);
    console.log('PATCH response:', await patchRes.json());

    // 4. Verify /options again
    const verifyRes = await fetch(`${API_BASE}/options`);
    const verifyData = await verifyRes.json();
    console.log('Verified pricing:', verifyData[0].pricing);

    // 5. Restore options
    console.log('Restoring pricing back...');
    const restorePricing = {
      ...item.pricing,
      proteinUpgradePer: 20
    };
    await fetch(`${API_BASE}/options/${id}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        pricing: restorePricing
      })
    });

  } catch (err) {
    console.error('Error:', err);
  }
}

run();
