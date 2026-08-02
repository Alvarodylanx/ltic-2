// Copies ALL images from each species folder → uploads/media/
// then updates each timber product via API with the full gallery.
import { readdirSync, copyFileSync, existsSync, mkdirSync } from 'fs';
import { extname, join, basename } from 'path';

const BASE_FOLDER = 'C:\\Users\\Stainx\\Downloads\\Telegram Desktop\\new product';
const DEST = 'E:\\LTIC-SARL-new\\uploads\\media';
const API  = 'http://localhost:4000';

// Valid web image extensions
const VALID_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

// Files to skip even if they're in the folder (clearly wrong species)
const SKIP_FILES = new Set([
  'african-ebony-diospyros-crassiflora--599.jpg',   // Tali folder — wrong species
  'High-Quality-Unedged-Beach-Wood-Lumber.jpg',      // Tali folder — wrong species
]);

// Species config: folder name + product id + which file is the main/hero image
const SPECIES = [
  { folder: 'Azobe',    id: 81, mainHint: '4.jpg' },
  { folder: 'Bibinga',  id: 85, mainHint: '3271ce20c951b1f5066728512b8d19c6.jpg' },
  { folder: 'Doussié',  id: 82, mainHint: '2-3.jpg' },
  { folder: 'Iroko',    id: 78, mainHint: 'timbercut4u-buy-african-iroko-1573055038Iroko-002.webp' },
  { folder: 'Movingui', id: 80, mainHint: 'Movingui-Wood.jpg' },
  { folder: 'Pachi',    id: 79, mainHint: 'pachyloba-wood-logs.jpeg' },
  { folder: 'Padouk',   id: 83, mainHint: 'padauk-wood-3.jpeg' },
  { folder: 'tali',     id: 77, mainHint: 'Tali2-4-600x600.webp' },
  { folder: 'Teak',     id: 84, mainHint: 'teak-wood.jpg' },
];

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

async function main() {
  // --- 1. Copy images ---
  const results = [];

  for (const sp of SPECIES) {
    const srcDir  = join(BASE_FOLDER, sp.folder);
    const prefix  = slugify(sp.folder);       // e.g. "azobe", "doussie"
    const allFiles = readdirSync(srcDir);
    const validFiles = allFiles.filter(f =>
      VALID_EXTS.has(extname(f).toLowerCase()) && !SKIP_FILES.has(f)
    );

    // Put mainHint first; rest in original order
    const mainIdx = validFiles.indexOf(sp.mainHint);
    const ordered = mainIdx >= 0
      ? [sp.mainHint, ...validFiles.filter(f => f !== sp.mainHint)]
      : validFiles;

    const destUrls = [];
    for (let i = 0; i < ordered.length; i++) {
      const srcFile  = ordered[i];
      const ext      = extname(srcFile).toLowerCase();
      const destName = `${prefix}-${i + 1}${ext}`;
      const destPath = join(DEST, destName);
      copyFileSync(join(srcDir, srcFile), destPath);
      destUrls.push(`/uploads/media/${destName}`);
      console.log(`  Copied ${srcFile} → ${destName}`);
    }

    results.push({ id: sp.id, folder: sp.folder, imageUrl: destUrls[0], images: destUrls.slice(1) });
    console.log(`✓ ${sp.folder}: ${ordered.length} image(s)\n`);
  }

  // --- 2. Login ---
  console.log('Logging in to API...');
  const loginRes = await fetch(`${API}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'alvarodylan10@gmail.com', password: '655197772a' }),
  });
  const cookie = loginRes.headers.get('set-cookie') || '';
  const match  = cookie.match(/admin_jwt=([^;]+)/);
  if (!match) { console.error('Login failed'); process.exit(1); }
  const jwt = match[1];
  console.log('Logged in.\n');

  // --- 3. PATCH each product ---
  let ok = 0, fail = 0;
  for (const r of results) {
    const res = await fetch(`${API}/api/products/${r.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Cookie: `admin_jwt=${jwt}` },
      body: JSON.stringify({ imageUrl: r.imageUrl, images: r.images }),
    });
    if (res.ok) {
      console.log(`✓ [${r.id}] ${r.folder}  main=${r.imageUrl}  +${r.images.length} gallery`);
      ok++;
    } else {
      console.error(`✗ [${r.id}] ${r.folder}  ${res.status}: ${await res.text()}`);
      fail++;
    }
  }

  console.log(`\nDone — Updated: ${ok}  Failed: ${fail}`);
}

main().catch(console.error);
