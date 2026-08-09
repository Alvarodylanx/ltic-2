import { Pool } from "pg";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const products = [
      {
        nameEn: "ECOKLIN Multi-Purpose Soap — 5L",
        nameFr: "Savon Multi Usages ECOKLIN — 5L",
        slug: "ecoklin-savon-multi-usages",
        categoryId: 15,
        featured: true,
        available: true,
        imageUrl: "/uploads/media/ecoklin-savon-multi-usages.jpg",
        descriptionEn:
          "ECOKLIN Multi-Purpose Soap is a concentrated liquid soap for home and professional use. Cleans deeply, degreasers effectively, gentle on hands with a pleasant fragrance. Eliminates grease and dirt on all washable surfaces. Available in 5L.",
        descriptionFr:
          "Le Savon Multi Usages ECOKLIN est un savon liquide concentré pour usage domestique et professionnel. Nettoie en profondeur, dégraisse efficacement, doux pour les mains avec un parfum agréable. Élimine les graisses et salissures sur toutes les surfaces lavables. Disponible en 5L.",
        specifications:
          "Brand: ECOKLIN | Size: 5L | Type: Multi-purpose liquid soap | Features: Deep cleaning, effective degreasing, skin-friendly, pleasant fragrance, concentrated formula | Usage: Floors, surfaces, household cleaning",
      },
      {
        nameEn: "ECOKLIN Muriatic Acid — 5L",
        nameFr: "Acide Muriatique ECOKLIN — 5L",
        slug: "ecoklin-muriatic-acid",
        categoryId: 15,
        featured: false,
        available: true,
        imageUrl: "/uploads/media/ecoklin-muriatic-acid.jpg",
        descriptionEn:
          "ECOKLIN Muriatic Acid is a powerful heavy-duty acid cleaner that dissolves scale, rust and mineral deposits on contact. Ideal for deep cleaning of tiles, concrete, industrial equipment and sanitary ware. Eliminates 99.9% of scale, rust and mineral deposits. Available in 5L.",
        descriptionFr:
          "L'Acide Muriatique ECOKLIN est un décapant acide puissant qui dissout instantanément le tartre, la rouille et les dépôts minéraux. Idéal pour le nettoyage en profondeur des carrelages, bétons, équipements industriels et sanitaires. Élimine 99,9% du tartre, de la rouille et des dépôts minéraux. Disponible en 5L.",
        specifications:
          "Brand: ECOKLIN | Size: 5L | Type: Acid cleaner | Active agent: Hydrochloric acid | Eliminates: Scale, rust, mineral deposits (99.9%) | Usage: Tiles, concrete, industrial surfaces, sanitary ware | Handle with protective gloves",
      },
      {
        nameEn: "ECOKLIN Bleach (Eau de Javel) — 5L",
        nameFr: "Eau de Javel ECOKLIN — 5L",
        slug: "ecoklin-eau-de-javel",
        categoryId: 15,
        featured: true,
        available: true,
        imageUrl: "/uploads/media/ecoklin-eau-de-javel.jpg",
        descriptionEn:
          "ECOKLIN Bleach (Eau de Javel) is a professional-grade disinfectant and whitening agent. Disinfects, whitens, cleans and deodorises all washable surfaces. Eliminates 99.9% of germs and bacteria. Multi-purpose formula for home, industrial and institutional use. Available in 5L.",
        descriptionFr:
          "L'Eau de Javel ECOKLIN est un désinfectant et agent de blanchiment de qualité professionnelle. Désinfecte, blanchit, nettoie et déodorise toutes les surfaces lavables. Élimine 99,9% des germes et bactéries. Formule multi-usages pour usage domestique, industriel et institutionnel. Disponible en 5L.",
        specifications:
          "Brand: ECOKLIN | Size: 5L | Type: Chlorine bleach | Eliminates: 99.9% of germs and bacteria | Properties: Disinfecting, whitening, cleaning, deodorising | Usage: Floors, toilets, laundry, surfaces, kitchens",
      },
      {
        nameEn: "ECOKLIN Industrial Degreaser — 5L",
        nameFr: "Dégraissant Industriel ECOKLIN — 5L",
        slug: "ecoklin-degraisser",
        categoryId: 15,
        featured: false,
        available: true,
        imageUrl: "/uploads/media/ecoklin-degraisser.jpg",
        descriptionEn:
          "ECOKLIN Industrial Degreaser is a powerful formula that eliminates grease, oil and stubborn dirt on all surfaces. Cleans in depth and removes 99.9% of grease and soiling. Suitable for industrial kitchens, workshops, machinery, floors and all washable surfaces. Available in 5L.",
        descriptionFr:
          "Le Dégraissant Industriel ECOKLIN est une formule puissante qui élimine les graisses, huiles et salissures tenaces sur toutes les surfaces. Nettoie en profondeur et élimine 99,9% des graisses et salissures. Convient aux cuisines industrielles, ateliers, machines, sols et toutes surfaces lavables. Disponible en 5L.",
        specifications:
          "Brand: ECOKLIN | Size: 5L | Type: Industrial degreaser | Eliminates: 99.9% of grease and soiling | Properties: Deep cleaning, powerful degreasing | Usage: Industrial kitchens, workshops, machinery, floors, surfaces",
      },
    ];

    for (const p of products) {
      const res = await client.query(
        `INSERT INTO products (
          name_en, name_fr, slug, category_id, featured, available,
          image_url, description_en, description_fr, specifications,
          created_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW())
        ON CONFLICT (slug) DO UPDATE SET
          name_en = EXCLUDED.name_en,
          name_fr = EXCLUDED.name_fr,
          category_id = EXCLUDED.category_id,
          featured = EXCLUDED.featured,
          available = EXCLUDED.available,
          image_url = EXCLUDED.image_url,
          description_en = EXCLUDED.description_en,
          description_fr = EXCLUDED.description_fr,
          specifications = EXCLUDED.specifications
        RETURNING id`,
        [
          p.nameEn, p.nameFr, p.slug, p.categoryId, p.featured, p.available,
          p.imageUrl, p.descriptionEn, p.descriptionFr, p.specifications,
        ],
      );
      console.log(`✓ Upserted: ${p.nameEn} (id:${res.rows[0].id})`);
    }

    await client.query("COMMIT");
    console.log("✅ All 4 ECOKLIN products inserted.");
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
