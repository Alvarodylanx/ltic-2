import { Pool } from "pg";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const contacts: { key: string; value: string }[] = [
  { key: "company_phone",   value: "+237699213603" },
  { key: "company_phone_2", value: "+27736500033" },
  { key: "social_whatsapp", value: "https://wa.me/27640370007" },
];

async function run() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const { key, value } of contacts) {
      await client.query(
        `INSERT INTO settings (key, value, updated_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
        [key, value],
      );
      console.log(`✓ Set ${key} = ${value}`);
    }
    await client.query("COMMIT");
    console.log("✅ Contact settings updated.");
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
