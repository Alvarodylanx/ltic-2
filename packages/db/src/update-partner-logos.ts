import { Pool } from "pg";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const updates: { id: number; logoUrl: string | null }[] = [
  { id: 410, logoUrl: "/images/brands/bourbon-offshore.png" },
  { id: 411, logoUrl: "/images/brands/inyanga-maritime.png" },
  { id: 412, logoUrl: "/images/brands/alpha-marine.png" },
  { id: 413, logoUrl: "/images/brands/bollore.svg" },
  { id: 414, logoUrl: "/images/brands/maersk.png" },
  { id: 415, logoUrl: "/images/brands/msc.png" },
  { id: 416, logoUrl: null },  // PASTA S.A — no logo, show initials
  { id: 417, logoUrl: null },  // NEO INDUSTRY S.A — no logo
  { id: 418, logoUrl: null },  // MOVIS S.A — no logo
  { id: 419, logoUrl: "/images/brands/solena.jpg" },
  { id: 420, logoUrl: "/images/brands/total.png" },
  { id: 421, logoUrl: "/images/brands/shell.png" },
  { id: 422, logoUrl: "/images/brands/caterpillar.png" },
  { id: 423, logoUrl: "/images/brands/volvo.png" },
  { id: 424, logoUrl: "/images/brands/komatsu.png" },
  { id: 425, logoUrl: "/images/brands/cummins.png" },
  { id: 427, logoUrl: "/images/brands/cma-cgm.png" },
  { id: 428, logoUrl: "/images/brands/dhl.png" },
  { id: 429, logoUrl: "/images/brands/bollore.svg" },
  { id: 430, logoUrl: "/images/brands/liebherr.png" },
  { id: 431, logoUrl: "/images/brands/eiffage.png" },
];

async function run() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const { id, logoUrl } of updates) {
      await client.query("UPDATE partners SET logo_url = $1 WHERE id = $2", [logoUrl, id]);
      console.log(`✓ id:${id} → ${logoUrl ?? "(initials)"}`);
    }
    await client.query("COMMIT");
    console.log("✅ All partner logos updated.");
  } catch (e) {
    await client.query("ROLLBACK");
    console.error("❌ Failed:", e);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
