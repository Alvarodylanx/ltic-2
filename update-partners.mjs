const API = 'http://localhost:4000';

const CLIENTS = [
  { name: 'Bourbon Offshore Marine', sectorEn: 'Marine Services',  sectorFr: 'Services Maritimes',  logoUrl: '', website: '' },
  { name: 'Inyanga Maritime',         sectorEn: 'Maritime',          sectorFr: 'Maritime',             logoUrl: '', website: '' },
  { name: 'Alpha Marine',             sectorEn: 'Maritime',          sectorFr: 'Maritime',             logoUrl: '', website: '' },
  { name: 'Bolloré Africa',           sectorEn: 'Logistics',         sectorFr: 'Logistique',           logoUrl: 'https://www.google.com/s2/favicons?domain=bollore.com&sz=128', website: 'https://bollore.com' },
  { name: 'Maersk',                   sectorEn: 'Shipping',          sectorFr: 'Transport Maritime',   logoUrl: 'https://www.google.com/s2/favicons?domain=maersk.com&sz=128',  website: 'https://maersk.com' },
  { name: 'MSC',                      sectorEn: 'Shipping',          sectorFr: 'Transport Maritime',   logoUrl: 'https://www.google.com/s2/favicons?domain=msc.com&sz=128',    website: 'https://msc.com' },
  { name: 'PASTA S.A',                sectorEn: 'Industry',          sectorFr: 'Industrie',            logoUrl: '', website: '' },
  { name: 'NEO INDUSTRY S.A',         sectorEn: 'Industry',          sectorFr: 'Industrie',            logoUrl: '', website: '' },
  { name: 'MOVIS S.A',                sectorEn: 'Logistics',         sectorFr: 'Logistique',           logoUrl: '', website: '' },
  { name: 'SOLENA SARL',              sectorEn: 'Industry',          sectorFr: 'Industrie',            logoUrl: '', website: '' },
];

// Login
const login = await fetch(`${API}/api/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'alvarodylan10@gmail.com', password: '655197772a' }),
});
const jwt = (login.headers.get('set-cookie') || '').match(/admin_jwt=([^;]+)/)?.[1];
if (!jwt) { console.error('Login failed'); process.exit(1); }
console.log('Logged in.\n');

// Fetch existing partners
const existing = await fetch(`${API}/api/partners`).then(r => r.json());
console.log(`Found ${existing.length} existing partners — deleting...`);

// Delete all existing
for (const p of existing) {
  const res = await fetch(`${API}/api/partners/${p.id}`, {
    method: 'DELETE',
    headers: { Cookie: `admin_jwt=${jwt}` },
  });
  console.log(`  ${res.ok || res.status === 404 ? '✓' : '✗'} Deleted [${p.id}] ${p.name}`);
}

console.log('\nAdding real clients...');

// Add the real clients
for (let i = 0; i < CLIENTS.length; i++) {
  const c = CLIENTS[i];
  const res = await fetch(`${API}/api/partners`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: `admin_jwt=${jwt}` },
    body: JSON.stringify({ ...c, displayOrder: i + 1, active: true }),
  });
  const data = await res.json().catch(() => ({}));
  console.log(`  ${res.ok ? '✓' : '✗'} Added [${data.id || '?'}] ${c.name}`);
}

console.log('\nDone.');
