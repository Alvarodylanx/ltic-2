// Updates each timber product with the correct species-specific image URLs
import { readFileSync } from 'fs';

const BASE = 'http://localhost:4000';

// Product IDs + their correct images
const TIMBER_UPDATES = [
  {
    id: 77, name: 'Tali',
    imageUrl: '/uploads/media/tali-main.webp',
    images: ['/uploads/media/tali-planks.webp'],
  },
  {
    id: 78, name: 'Iroko',
    imageUrl: '/uploads/media/iroko-main.webp',
    images: ['/uploads/media/iroko-grain.jpg', '/uploads/media/iroko-logs.jpg'],
  },
  {
    id: 79, name: 'Pachi',
    imageUrl: '/uploads/media/pachi-main.jpg',
    images: [],
  },
  {
    id: 80, name: 'Movingui',
    imageUrl: '/uploads/media/movingui-main.jpg',
    images: ['/uploads/media/movingui-grain.jpg'],
  },
  {
    id: 81, name: 'Azobe',
    imageUrl: '/uploads/media/azobe-main.jpg',
    images: ['/uploads/media/azobe-logs-forest.jpg', '/uploads/media/azobe-application.jpg'],
  },
  {
    id: 82, name: 'Doussié',
    imageUrl: '/uploads/media/doussie-main.jpg',
    images: ['/uploads/media/doussie-logs.jpg', '/uploads/media/doussie-stacked.jpg'],
  },
  {
    id: 83, name: 'Padouk',
    imageUrl: '/uploads/media/padouk-main.jpg',
    images: ['/uploads/media/padouk-grain.jpg'],
  },
  {
    id: 84, name: 'Teak',
    imageUrl: '/uploads/media/teak-main.jpg',
    images: ['/uploads/media/teak-logs.jpg'],
  },
  {
    id: 85, name: 'Bibinga',
    imageUrl: '/uploads/media/bibinga-main.jpg',
    images: ['/uploads/media/bibinga-planks.jpg'],
  },
];

async function main() {
  // 1. Login to get admin_jwt cookie
  console.log('Logging in...');
  const loginRes = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'alvarodylan10@gmail.com', password: '655197772a' }),
  });

  const setCookie = loginRes.headers.get('set-cookie') || '';
  const match = setCookie.match(/admin_jwt=([^;]+)/);
  if (!match) {
    console.error('Login failed — no admin_jwt cookie');
    const body = await loginRes.text();
    console.error('Response:', body);
    process.exit(1);
  }
  const jwt = match[1];
  console.log('Logged in successfully.\n');

  // 2. PATCH each timber product
  let ok = 0, fail = 0;
  for (const p of TIMBER_UPDATES) {
    const res = await fetch(`${BASE}/api/products/${p.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `admin_jwt=${jwt}`,
      },
      body: JSON.stringify({
        imageUrl: p.imageUrl,
        images: p.images,
      }),
    });

    if (res.ok) {
      console.log(`✓  [${p.id}] ${p.name}`);
      ok++;
    } else {
      const err = await res.text();
      console.error(`✗  [${p.id}] ${p.name} — ${res.status}: ${err}`);
      fail++;
    }
  }

  console.log(`\nDone — Updated: ${ok}  Failed: ${fail}`);
}

main().catch(console.error);
