import { Pool } from "pg";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const res = await client.query(`
      INSERT INTO categories (name_en, name_fr, slug, description_en, description_fr)
      VALUES (
        'Other Products',
        'Autres Produits',
        'other-products',
        'General commercial goods and miscellaneous products distributed by LTIC SARL.',
        'Produits commerciaux généraux et articles divers distribués par LTIC SARL.'
      )
      ON CONFLICT (slug) DO UPDATE SET name_en = EXCLUDED.name_en
      RETURNING id
    `);
    const newId = res.rows[0].id;
    console.log(`✓ Created "Other Products" category (id:${newId})`);

    await client.query(`UPDATE products SET category_id = $1 WHERE id = 48`, [newId]);
    console.log(`✓ Moved A4 Paper (id:48) → other-products (id:${newId})`);

    await client.query("COMMIT");
    console.log("✅ Done.");
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
