import { Pool } from "pg";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const articles = [
  {
    slug: "ltic-expands-5-new-countries",
    titleEn: "LTIC SARL: Your Trusted Ship Supplier in the Gulf of Guinea",
    titleFr: "LTIC SARL : Votre Fournisseur Maritime de Confiance dans le Golfe de Guinée",
    summaryEn: "From the port of Douala to offshore platforms across the Gulf of Guinea, LTIC SARL delivers reliable ship chandling, vessel maintenance and maritime supply to vessels of all types.",
    summaryFr: "Du port de Douala aux plateformes offshore du Golfe de Guinée, LTIC SARL assure l'avitaillement, la maintenance et la fourniture maritime pour tous types de navires.",
    contentEn: `LTIC SARL has established itself as a leading general ship supplier operating out of Douala, Cameroon — the largest port city in Central Africa. With direct access to the Port of Douala and a network extending across the Gulf of Guinea, we provide end-to-end maritime supply solutions for commercial vessels, offshore platforms and naval support craft.

**What We Supply**

Our ship chandling services cover a full range of vessel needs: provisions, deck and engine spare parts, safety equipment, lubricants (Total, Shell and other certified brands), cleaning chemicals, ropes, fenders, and more. Whether your vessel is anchored at Douala, Kribi, Limbe, or operating offshore in Cameroonian or Equatoguinean waters, our team can reach you.

**Offshore & Sludging Services**

Beyond basic chandling, LTIC SARL offers offshore logistics support and sludge removal services for vessels operating in the deep-water fields of the Gulf of Guinea. We coordinate with port authorities and work under strict environmental compliance guidelines.

**Why Choose LTIC SARL**

Speed, reliability and local expertise set us apart. Our team knows the Port of Douala intimately — customs procedures, berth availability, local suppliers — and we use that knowledge to turn around orders fast. International shipping companies and offshore operators trust us because we deliver exactly what we promise, on time.

Contact us for a ship supply quote or to discuss a standing supply agreement for your fleet.`,
    contentFr: `LTIC SARL s'est imposée comme un fournisseur général de navires de premier plan basé à Douala, Cameroun — la plus grande ville portuaire d'Afrique Centrale. Avec un accès direct au Port de Douala et un réseau s'étendant sur tout le Golfe de Guinée, nous proposons des solutions d'approvisionnement maritime complètes pour les navires commerciaux, les plateformes offshore et les bateaux de support naval.

**Ce que nous fournissons**

Nos services d'avitaillement couvrent l'ensemble des besoins des navires : vivres, pièces détachées pont et moteur, équipements de sécurité, lubrifiants (Total, Shell et autres marques certifiées), produits chimiques de nettoyage, cordages, défenses et plus encore.

**Services Offshore et de Dégazage**

Au-delà de l'avitaillement de base, LTIC SARL propose un soutien logistique offshore et des services d'enlèvement des boues pour les navires opérant dans les champs en eaux profondes du Golfe de Guinée.

**Pourquoi choisir LTIC SARL**

La rapidité, la fiabilité et l'expertise locale nous distinguent. Notre équipe connaît parfaitement le Port de Douala — procédures douanières, disponibilité des postes d'amarrage, fournisseurs locaux — et nous mettons cette connaissance au service de délais d'exécution rapides.

Contactez-nous pour un devis d'approvisionnement ou pour discuter d'un accord d'approvisionnement permanent pour votre flotte.`,
    imageUrl: "/images/hero-slide-1.jpg",
    category: "Company News",
  },
  {
    slug: "phytosanitary-requirements-timber-export",
    titleEn: "Certified Tropical Timber from Central Africa — LTIC SARL's Timber Export Service",
    titleFr: "Bois Tropicaux Certifiés d'Afrique Centrale — Service Export Bois de LTIC SARL",
    summaryEn: "LTIC SARL supplies certified tropical timber species — Tali, Iroko, Azobé, Pachi, Doussié and more — sourced from Central African forests with full phytosanitary documentation for international export.",
    summaryFr: "LTIC SARL fournit des essences tropicales certifiées — Tali, Iroko, Azobé, Pachi, Doussié et autres — issues des forêts d'Afrique Centrale avec toute la documentation phytosanitaire pour l'export international.",
    contentEn: `Central Africa is home to some of the world's most prized tropical timber species, and LTIC SARL is your direct link to certified, export-ready timber sourced from the forests of Cameroon and neighboring countries.

**Our Timber Species**

We supply the following certified tropical species:

- **Tali (Erythrophleum ivorense)** — Dense, durable hardwood used in heavy construction, marine decking and bridge works.
- **Iroko (Milicia excelsa)** — A highly versatile hardwood, often used as a teak substitute. Excellent for joinery, flooring and boat building.
- **Azobé (Lophira alata)** — Extremely hard and resistant to decay; ideal for hydraulic works, railway sleepers and marine construction.
- **Pachi (Manilkara obovata)** — Strong and heavy, used in construction and heavy carpentry.
- **Doussié (Afzelia bipindensis)** — Premium furniture-grade hardwood with beautiful grain and natural oils.
- **Padou / Padouk (Pterocarpus soyauxii)** — Red hardwood prized for decorative flooring and high-end cabinetry.
- **Movingui (Distemonanthus benthamianus)** — Yellow hardwood used in flooring, joinery and decorative applications.
- **Teak (Tectona grandis)** — Premium marine and outdoor timber, highly resistant to moisture.
- **Bibinga (Baillonella toxisperma)** — Dense African hardwood suitable for heavy structural applications.

**Phytosanitary Compliance**

All timber exported by LTIC SARL is accompanied by full phytosanitary documentation including:
- Phytosanitary certificates issued by Cameroon's competent authority
- ISPM 15 compliant heat treatment where required
- FLEGT / legality verification documentation
- Full species identification and origin traceability

**How to Order**

We supply timber in logs, cants, sawn lumber and finished dimensions depending on client requirements. Minimum order quantities apply for export. Contact our commercial team for availability, pricing and documentation lead times.`,
    contentFr: `L'Afrique Centrale abrite certaines des essences tropicales les plus précieuses au monde, et LTIC SARL est votre lien direct avec du bois certifié, prêt à l'export, issu des forêts du Cameroun et des pays voisins.

**Nos Essences**

Nous fournissons les essences tropicales certifiées suivantes : Tali, Iroko, Azobé, Pachi, Doussié, Padouk, Movingui, Teck et Bibinga.

**Conformité Phytosanitaire**

Tout le bois exporté par LTIC SARL est accompagné d'une documentation phytosanitaire complète : certificats phytosanitaires délivrés par l'autorité compétente camerounaise, traitement thermique conforme à la NIMP 15, documentation de vérification de légalité FLEGT, et traçabilité complète des espèces et de l'origine.

**Comment Commander**

Nous fournissons le bois en grumes, avivés, bois scié et dimensions finies selon les exigences du client. Des quantités minimales de commande s'appliquent pour l'export. Contactez notre équipe commerciale pour la disponibilité, les prix et les délais de documentation.`,
    imageUrl: "/images/timber-logs.jpg",
    category: "Industry Insights",
  },
  {
    slug: "ecoklin-made-in-douala",
    titleEn: "ECOKLIN — LTIC SARL's Own Brand of Cleaning & Hygiene Products, Made in Douala",
    titleFr: "ECOKLIN — La Marque Propre de LTIC SARL pour les Produits de Nettoyage, Fabriqués à Douala",
    summaryEn: "LTIC SARL manufactures a complete range of cleaning, hygiene and sanitation products under the ECOKLIN brand at our factory in PK13, Douala. Eco-friendly, biodegradable and available across Central Africa.",
    summaryFr: "LTIC SARL fabrique une gamme complète de produits de nettoyage, d'hygiène et d'assainissement sous la marque ECOKLIN dans notre usine à PK13, Douala. Écologiques, biodégradables et disponibles en Afrique Centrale.",
    contentEn: `LTIC SARL is proud to be a manufacturer, not just a trader. Under our ECOKLIN brand, we produce a full line of cleaning and hygiene products at our dedicated factory located in PK13, Douala, Cameroon.

**Why ECOKLIN?**

The ECOKLIN brand was born from a simple observation: Central Africa needed reliable, locally manufactured cleaning and sanitation products at accessible prices. Instead of depending entirely on imported goods, LTIC SARL invested in local production — creating jobs in Douala while delivering quality products across the region.

Every ECOKLIN product is formulated to be eco-friendly and biodegradable, meeting modern environmental standards without compromising cleaning effectiveness.

**Our Product Range**

The ECOKLIN lineup currently includes:

- **Eau de Javel (Bleach)** — Professional-grade chlorine bleach for disinfection, whitening and surface sanitation. Eliminates 99.9% of germs and bacteria.
- **Dégraissant Industriel (Industrial Degreaser)** — Powerful formula for removing grease, oil and stubborn soiling from industrial surfaces, machinery and kitchen equipment.
- **Savon Multi Usages (Multi-Purpose Soap)** — Concentrated liquid soap for floors, surfaces and general household cleaning.
- **Acide Muriatique (Muriatic Acid)** — Heavy-duty acid cleaner for descaling tiles, concrete and industrial surfaces. Removes rust, scale and mineral deposits.
- **Détartrant (Descaler)** — Targeted formula for removing limescale from sanitary fittings, kitchen equipment and industrial pipework.
- **Savon Liquide pour Carreaux** — Tile-specific liquid soap for streak-free cleaning of all types of floor and wall tiles.
- **Savon Liquide pour Lessive** — Laundry liquid soap formulated for hand and machine washing.
- **Savon Liquide pour Vaisselle** — Dish washing liquid, effective against grease and food residue.

All products are available in 5-litre containers, with bulk supply options for businesses, institutions and distributors.

**Distribution**

ECOKLIN products are distributed across Cameroon and neighboring Central African countries. We supply hotels, hospitals, restaurants, cleaning companies, supermarkets, and wholesale distributors. Contact us to discuss wholesale pricing and distribution agreements.`,
    contentFr: `LTIC SARL est fière d'être un fabricant, et pas seulement un commerçant. Sous notre marque ECOKLIN, nous produisons une gamme complète de produits de nettoyage et d'hygiène dans notre usine dédiée à PK13, Douala, Cameroun.

**Pourquoi ECOKLIN ?**

La marque ECOKLIN est née d'un constat simple : l'Afrique Centrale avait besoin de produits de nettoyage et d'assainissement fabriqués localement à des prix accessibles. Au lieu de dépendre entièrement de produits importés, LTIC SARL a investi dans la production locale — créant des emplois à Douala tout en livrant des produits de qualité dans toute la région.

**Notre Gamme de Produits**

La gamme ECOKLIN comprend actuellement : Eau de Javel, Dégraissant Industriel, Savon Multi Usages, Acide Muriatique, Détartrant, Savon Liquide pour Carreaux, Savon Liquide pour Lessive, et Savon Liquide pour Vaisselle.

Tous les produits sont disponibles en contenants de 5 litres, avec des options d'approvisionnement en vrac pour les entreprises, les institutions et les distributeurs.

**Distribution**

Les produits ECOKLIN sont distribués au Cameroun et dans les pays d'Afrique Centrale voisins. Nous fournissons les hôtels, hôpitaux, restaurants, entreprises de nettoyage, supermarchés et grossistes. Contactez-nous pour discuter des tarifs en gros et des accords de distribution.`,
    imageUrl: "/images/ecoklin-factory.jpg",
    category: "Company News",
  },
];

async function run() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (const a of articles) {
      const res = await client.query(
        `INSERT INTO news (
          slug, title_en, title_fr, summary_en, summary_fr,
          content_en, content_fr, image_url, category, published, published_at, created_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,true,NOW(),NOW())
        ON CONFLICT (slug) DO UPDATE SET
          title_en = EXCLUDED.title_en, title_fr = EXCLUDED.title_fr,
          summary_en = EXCLUDED.summary_en, summary_fr = EXCLUDED.summary_fr,
          content_en = EXCLUDED.content_en, content_fr = EXCLUDED.content_fr,
          image_url = EXCLUDED.image_url, category = EXCLUDED.category,
          published = true
        RETURNING id`,
        [a.slug, a.titleEn, a.titleFr, a.summaryEn, a.summaryFr,
         a.contentEn, a.contentFr, a.imageUrl, a.category],
      );
      console.log(`✓ Upserted: "${a.titleEn.slice(0, 60)}..." (id:${res.rows[0].id})`);
    }

    await client.query("COMMIT");
    console.log("✅ All articles updated.");
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
