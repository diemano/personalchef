const API_BASE = 'https://chefdesk-api-963913766778.us-central1.run.app';

async function run() {
  try {
    const res = await fetch(`${API_BASE}/`);
    console.log('Root status:', res.status);
    console.log('Root headers:', Object.fromEntries(res.headers.entries()));
    const body = await res.text();
    console.log('Root body:', body.substring(0, 500));

    const resDocs = await fetch(`${API_BASE}/docs`);
    console.log('\nDocs status:', resDocs.status);
    if (resDocs.ok) {
      console.log('Docs content type:', resDocs.headers.get('content-type'));
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
