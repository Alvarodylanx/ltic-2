const API = 'http://localhost:4000';

const TO_DELETE = [
  { id: 63, name: 'Bubinga (duplicate of Bibinga/85)' },
  { id: 64, name: 'Iroko old entry (duplicate of 78)' },
  { id: 65, name: 'Doussie old entry (duplicate of 82)' },
  { id: 66, name: 'Sapelli (no catalog)' },
  { id: 67, name: 'Moabi (no catalog)' },
  { id: 68, name: 'Padouk old entry (duplicate of 83)' },
  { id: 74, name: 'Generic Tropical Hardwood Sawn Timber' },
  { id: 75, name: 'Generic Certified Tropical Timber Logs' },
];

const login = await fetch(`${API}/api/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'alvarodylan10@gmail.com', password: '655197772a' }),
});
const jwt = (login.headers.get('set-cookie') || '').match(/admin_jwt=([^;]+)/)?.[1];
if (!jwt) { console.error('Login failed'); process.exit(1); }
console.log('Logged in.\n');

for (const { id, name } of TO_DELETE) {
  const res = await fetch(`${API}/api/products/${id}`, {
    method: 'DELETE',
    headers: { Cookie: `admin_jwt=${jwt}` },
  });
  if (res.ok || res.status === 404) {
    console.log(`✓  Deleted [${id}] ${name}`);
  } else {
    console.error(`✗  Failed  [${id}] ${res.status}`);
  }
}
console.log('\nDone.');
