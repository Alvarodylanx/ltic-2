/**
 * One-time migration: reclassify categories and products to match
 * the customer's actual business structure.
 *
 * Run with:  pnpm --filter db migrate
 */

import { Pool } from "pg";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // ── 1. RENAME EXISTING CATEGORIES IN-PLACE ──────────────────────────────

    // lubricants-oils (id:3) → lubricants
    await client.query(`
      UPDATE categories SET
        slug          = 'lubricants',
        name_en       = 'Lubricants Oil',
        name_fr       = 'Lubrifiants',
        description_en = 'Total and Shell motor and vessel lubricants exclusively — engine oils, marine lubricants, hydraulic and gear oils.',
        description_fr = 'Lubrifiants moteur et marine Total et Shell exclusivement — huiles moteur, lubrifiants marins, huiles hydrauliques et de boîte.'
      WHERE id = 3
    `);
    console.log("✓ id:3  lubricants-oils → lubricants");

    // filters-parts (id:4) → filters
    await client.query(`
      UPDATE categories SET
        slug          = 'filters',
        name_en       = 'Filters',
        name_fr       = 'Filtres',
        description_en = 'Oil, air and fuel filters for all equipment types — OEM-grade for generators, engines and industrial machinery.',
        description_fr = 'Filtres huile, air et carburant pour tous équipements — qualité OEM pour groupes électrogènes, moteurs et machines industrielles.'
      WHERE id = 4
    `);
    console.log("✓ id:4  filters-parts → filters");

    // general-industrial (id:5) → spare-parts
    await client.query(`
      UPDATE categories SET
        slug          = 'spare-parts',
        name_en       = 'Engines & Spare Parts',
        name_fr       = 'Moteurs & Pièces Détachées',
        description_en = 'Marine and industrial engines, spare parts and components for vessels and heavy equipment.',
        description_fr = 'Moteurs maritimes et industriels, pièces de rechange et composants pour navires et équipements lourds.'
      WHERE id = 5
    `);
    console.log("✓ id:5  general-industrial → spare-parts");

    // generators (id:2) — fix name
    await client.query(`
      UPDATE categories SET
        name_en       = 'Generators',
        name_fr       = 'Groupes Électrogènes',
        description_en = 'Diesel and gas generators for industrial and commercial use — supplied across Central Africa and neighboring countries.',
        description_fr = 'Groupes électrogènes diesel et gaz pour usage industriel et commercial — fournis en Afrique Centrale et dans les pays voisins.'
      WHERE id = 2
    `);
    console.log("✓ id:2  Industrial Generators → Generators");

    // timber-logs (id:1) — update description to match new content
    await client.query(`
      UPDATE categories SET
        description_en = 'Certified tropical timber species — Tali, Iroko, Pachi, Movingui, Azobe, Doussié, Padou, Teak and Bibinga.',
        description_fr = 'Essences tropicales certifiées — Tali, Iroko, Pachi, Movingui, Azobé, Doussié, Padou, Teck et Bibinga.'
      WHERE id = 1
    `);
    console.log("✓ id:1  timber-logs description updated");

    // ── 2. CREATE NEW CATEGORIES ─────────────────────────────────────────────

    const chemRes = await client.query(`
      INSERT INTO categories (name_en, name_fr, slug, description_en, description_fr, image_url)
      VALUES (
        'Chemical Products',
        'Produits Chimiques',
        'chemical-products',
        'ECOKLIN brand — bleach, degreasers, liquid soaps, muriatic acid and more. Plus industrial raw chemicals: SLES, LABSA, Sodium Hypochlorite, Calcium Hypochlorite and more.',
        'Marque ECOKLIN — eau de javel, dégraissants, savons liquides, acide muriatique et plus. Ainsi que produits chimiques industriels bruts : SLES, LABSA, hypochlorite de sodium, hypochlorite de calcium et plus.',
        'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=70'
      )
      ON CONFLICT (slug) DO UPDATE SET
        name_en        = EXCLUDED.name_en,
        description_en = EXCLUDED.description_en
      RETURNING id
    `);
    const chemId = chemRes.rows[0].id;
    console.log(`✓ chemical-products created/confirmed (id:${chemId})`);

    const marineRes = await client.query(`
      INSERT INTO categories (name_en, name_fr, slug, description_en, description_fr, image_url)
      VALUES (
        'Offshore & Maritime',
        'Offshore & Maritime',
        'offshore-maritime',
        'Maritime supplies, ship chandling, vessel maintenance products and MARPOL-compliant marine chemicals for Gulf of Guinea operations.',
        'Fournitures maritimes, avitaillement, produits de maintenance navires et produits chimiques marins conformes MARPOL pour les opérations dans le Golfe de Guinée.',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=70'
      )
      ON CONFLICT (slug) DO UPDATE SET
        name_en        = EXCLUDED.name_en,
        description_en = EXCLUDED.description_en
      RETURNING id
    `);
    const marineId = marineRes.rows[0].id;
    console.log(`✓ offshore-maritime created/confirmed (id:${marineId})`);

    // ── 3. MOVE PRODUCTS ─────────────────────────────────────────────────────

    // Industrial raw chemicals (from marine-maintenance-chemicals id:12) → chemical-products
    const chemProductIds = [49, 52, 53, 54, 55, 58, 59, 60, 61, 62];
    await client.query(
      `UPDATE products SET category_id = $1 WHERE id = ANY($2::int[])`,
      [chemId, chemProductIds]
    );
    console.log(`✓ Moved ${chemProductIds.length} industrial chemicals → chemical-products (id:${chemId})`);

    // Marine maintenance chemicals (from id:12) → offshore-maritime
    const marineProductIds = [42, 43, 44, 45];
    await client.query(
      `UPDATE products SET category_id = $1 WHERE id = ANY($2::int[])`,
      [marineId, marineProductIds]
    );
    console.log(`✓ Moved ${marineProductIds.length} marine chemicals → offshore-maritime (id:${marineId})`);

    // Automatic Scraper Filter (id:88) was in general-industrial → move to filters (id:4)
    await client.query(
      `UPDATE products SET category_id = 4 WHERE id = 88`
    );
    console.log("✓ Automatic Scraper Filter (id:88) → filters (id:4)");

    // ── 4. CLEAN UP extraCategoryIds — remove ref to cat 12 from all products ─

    // Filters cross-listed in cat 12: 87, 89, 90, 91, 92, 93
    const crossListedIds = [87, 89, 90, 91, 92, 93];
    await client.query(
      `UPDATE products
       SET extra_category_ids = array_remove(extra_category_ids, 12)
       WHERE id = ANY($1::int[])`,
      [crossListedIds]
    );
    console.log(`✓ Removed cat-12 cross-listing from filter products (ids: ${crossListedIds.join(", ")})`);

    // Also remove cat 12 from any other products that may reference it
    await client.query(
      `UPDATE products SET extra_category_ids = array_remove(extra_category_ids, 12)
       WHERE 12 = ANY(extra_category_ids)`
    );
    console.log("✓ Cleared any remaining cat-12 references in extra_category_ids");

    // ── 5. DELETE OLD EMPTY CATEGORY ─────────────────────────────────────────

    // Verify no products still under marine-maintenance-chemicals
    const remaining = await client.query(
      `SELECT COUNT(*) FROM products WHERE category_id = 12`
    );
    const count = parseInt(remaining.rows[0].count, 10);
    if (count > 0) {
      throw new Error(`Cannot delete cat 12: ${count} products still assigned to it`);
    }

    await client.query(`DELETE FROM categories WHERE id = 12`);
    console.log("✓ Deleted marine-maintenance-chemicals (id:12) — now empty");

    await client.query("COMMIT");
    console.log("\n✅ Migration complete.");

    // ── 6. SUMMARY ───────────────────────────────────────────────────────────
    const cats = await client.query(
      `SELECT id, slug, name_en,
              (SELECT COUNT(*) FROM products WHERE category_id = c.id) AS product_count
       FROM categories c ORDER BY id`
    );
    console.log("\nFinal category state:");
    for (const row of cats.rows) {
      console.log(`  id:${row.id.toString().padEnd(3)} ${row.slug.padEnd(30)} ${row.name_en} (${row.product_count} products)`);
    }

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Migration failed — rolled back:", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
