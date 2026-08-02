/**
 * Run: node add-products.mjs
 * Adds 8 new products to the LTIC SARL website via the API.
 * Make sure the API server is running on port 4000 first.
 */

const API = "http://localhost:4000/api";
const EMAIL = "alvarodylan10@gmail.com";
const PASSWORD = "655197772a";

// Category IDs (from DB)
const CAT = {
  TIMBER: 1,
  GENERATORS: 2,
  LUBRICANTS: 3,
  FILTERS: 4,
  GENERAL_INDUSTRIAL: 5,
  MARINE: 12,
  CHEMICALS: 13,
  FOOD_AGRI: 14,
};

const PRODUCTS = [
  {
    nameEn: "CAT 3516 Remanufactured Industrial Diesel Engine",
    nameFr: "Moteur Diesel Industriel CAT 3516 Remis à Neuf",
    slug: "cat-3516-industrial-diesel-engine",
    descriptionEn: "The Caterpillar 3516 is a V16 industrial diesel engine renowned for its exceptional power output and reliability in the most demanding environments. Our remanufactured units undergo full factory-grade overhaul with OEM specifications — including new pistons, liners, crankshaft bearings, injectors and complete re-sealing — guaranteeing performance equivalent to new equipment. Ideal for power generation, mining operations, marine propulsion, and heavy industrial machinery. Available for export with full documentation and warranty.",
    descriptionFr: "Le Caterpillar 3516 est un moteur diesel industriel V16 reconnu pour sa puissance exceptionnelle et sa fiabilité dans les environnements les plus exigeants. Nos unités remises à neuf font l'objet d'une révision complète aux normes OEM — incluant nouveaux pistons, chemises, coussinets de vilebrequin, injecteurs et joints complets — garantissant des performances équivalentes au neuf. Idéal pour la production d'énergie, l'exploitation minière, la propulsion marine et les machines industrielles lourdes. Disponible à l'export avec documentation complète et garantie.",
    imageUrl: "/uploads/media/cat-3516-engine-main.jpg",
    images: [
      "/uploads/media/cat-3516-engine-label.jpg",
      "/uploads/media/cat-3516-engine-flywheel.jpg",
      "/uploads/media/cat-3516-engine-transport.jpg",
      "/uploads/media/cat-3516-engine-exhibition.jpg",
    ],
    categoryId: CAT.GENERAL_INDUSTRIAL,
    featured: true,
    specifications: JSON.stringify({
      brand: "Caterpillar",
      model: "3516",
      type: "V16 Turbocharged Diesel",
      condition: "Remanufactured (OEM specs)",
      application: "Power generation, Mining, Marine, Industrial",
      certification: "Factory tested",
    }),
  },
  {
    nameEn: "Industrial Open-Frame Diesel Generator Set",
    nameFr: "Groupe Électrogène Diesel Open-Frame Industriel",
    slug: "industrial-open-frame-diesel-generator",
    descriptionEn: "High-capacity open-frame diesel generator set featuring a turbocharged multi-cylinder engine paired with a high-efficiency synchronous alternator. Designed for continuous heavy-duty power supply in industrial facilities, construction sites, data centres and marine environments. Available in output ranges from 80 kVA to 500 kVA. Equipped with digital controller panel, vibration-damping base frame, automatic voltage regulator (AVR), and dual fuel filtration system. Compliant with ISO 8528 standards. Ready for export.",
    descriptionFr: "Groupe électrogène diesel open-frame haute capacité avec moteur multi-cylindres turbocompressé couplé à un alternateur synchrone haute efficacité. Conçu pour une alimentation continue en milieu industriel, chantiers, centres de données et environnements marins. Disponible en puissances de 80 à 500 kVA. Équipé d'un panneau de contrôle numérique, châssis anti-vibrations, régulateur de tension automatique (AVR) et double filtration carburant. Conforme aux normes ISO 8528. Prêt à l'export.",
    imageUrl: "/uploads/media/diesel-genset-blue-main.jpg",
    images: [
      "/uploads/media/diesel-genset-blue-rear.jpg",
      "/uploads/media/diesel-genset-blue-outdoor.jpg",
      "/uploads/media/diesel-genset-blue-warehouse.jpg",
      "/uploads/media/diesel-genset-blue-side.jpg",
    ],
    categoryId: CAT.GENERATORS,
    featured: true,
    specifications: JSON.stringify({
      type: "Open-frame diesel generator set",
      powerRange: "80 kVA – 500 kVA",
      engine: "Turbocharged multi-cylinder diesel",
      alternator: "Brushless synchronous (AVR)",
      frequency: "50 Hz / 60 Hz",
      standard: "ISO 8528",
    }),
  },
  {
    nameEn: "Marine Diesel Engine — Propulsion Grade",
    nameFr: "Moteur Diesel Marin — Grade Propulsion",
    slug: "marine-diesel-engine-propulsion",
    descriptionEn: "Professional-grade marine diesel engine designed for vessel propulsion and auxiliary power in offshore and coastal operations. Features a turbocharged inline 6-cylinder configuration, full digital monitoring control panel, water-cooled exhaust manifold, and heavy-duty marine fuel filtration. Compatible with gearbox and reduction gear assemblies. Suitable for workboats, fishing vessels, patrol craft, and cargo ships up to 1,000 DWT. All units are tested and certified before delivery.",
    descriptionFr: "Moteur diesel marin de qualité professionnelle conçu pour la propulsion de navires et la puissance auxiliaire lors d'opérations offshore et côtières. Dispose d'une configuration turbocompressée 6 cylindres en ligne, d'un panneau de contrôle numérique complet, collecteur d'échappement refroidi à l'eau et filtration carburant marine lourde. Compatible avec les assemblages boîte de vitesse et réducteur. Adapté aux bateaux de travail, navires de pêche, patrouilleurs et cargos jusqu'à 1 000 TPL. Toutes les unités testées et certifiées avant livraison.",
    imageUrl: "/uploads/media/marine-diesel-engine-main.jpg",
    images: [],
    categoryId: CAT.GENERATORS,
    featured: false,
    specifications: JSON.stringify({
      type: "Marine diesel engine",
      configuration: "Inline 6-cylinder turbocharged",
      cooling: "Water-cooled",
      application: "Vessel propulsion, Auxiliary power",
      compatible: "Workboats, Fishing vessels, Patrol craft, Cargo ships",
      certification: "Pre-delivery tested and certified",
    }),
  },
  {
    nameEn: "Heavy-Duty Open-Frame Diesel Generator Set",
    nameFr: "Groupe Électrogène Diesel Open-Frame Lourd",
    slug: "heavy-duty-open-frame-diesel-generator",
    descriptionEn: "Robust heavy-duty open-frame diesel generator set in industrial black finish, built for demanding continuous power generation. Features a turbocharged diesel prime mover with high-efficiency brushless alternator, digital DSE controller with remote monitoring, and anti-corrosion chassis. Output range 100–800 kVA. Ideal for mining, oil & gas, construction and industrial backup power. Optional soundproof weatherproof canopy available on request.",
    descriptionFr: "Groupe électrogène diesel open-frame lourd en finition noire industrielle, conçu pour une production continue d'énergie exigeante. Équipé d'un moteur diesel turbocompressé avec alternateur sans balais haute efficacité, contrôleur numérique DSE avec surveillance à distance et châssis anti-corrosion. Puissance de 100 à 800 kVA. Idéal pour les mines, pétrole & gaz, construction et alimentation industrielle de secours. Capot insonorisé étanche disponible sur demande.",
    imageUrl: "/uploads/media/diesel-genset-black-main.jpg",
    images: [],
    categoryId: CAT.GENERATORS,
    featured: false,
    specifications: JSON.stringify({
      type: "Heavy-duty open-frame diesel generator",
      powerRange: "100 kVA – 800 kVA",
      controller: "DSE digital with remote monitoring",
      finish: "Industrial black anti-corrosion",
      application: "Mining, Oil & gas, Construction, Industrial backup",
    }),
  },
  {
    nameEn: "Cummins Silent Diesel Generator — Acoustic Canopy",
    nameFr: "Générateur Diesel Silencieux Cummins — Caisson Acoustique",
    slug: "cummins-silent-diesel-generator-canopy",
    descriptionEn: "Professional silent diesel generator powered by a genuine Cummins engine, enclosed in a weatherproof sound-attenuated acoustic canopy achieving <75 dB(A) at 7 meters. Ideal for hotels, hospitals, office buildings, telecom sites and noise-sensitive environments requiring reliable backup or prime power. Available from 20 kVA to 250 kVA. Includes integrated fuel tank, digital control panel, automatic transfer capability, and full CE marking. Factory-tested before shipment.",
    descriptionFr: "Générateur diesel silencieux professionnel motorisé Cummins, dans un caisson acoustique insonorisé et étanche atteignant <75 dB(A) à 7 mètres. Idéal pour hôtels, hôpitaux, immeubles de bureaux, sites télécoms et environnements sensibles au bruit. Disponible de 20 à 250 kVA. Réservoir intégré, panneau de contrôle numérique, transfert automatique et marquage CE complet. Testé en usine avant expédition.",
    imageUrl: "/uploads/media/cummins-silent-generator-main.jpg",
    images: [],
    categoryId: CAT.GENERATORS,
    featured: true,
    specifications: JSON.stringify({
      brand: "Cummins",
      type: "Silent canopy diesel generator",
      noiseLevel: "< 75 dB(A) at 7 m",
      powerRange: "20 kVA – 250 kVA",
      enclosure: "Weatherproof acoustic canopy",
      certification: "CE marked, Factory tested",
    }),
  },
  {
    nameEn: "Tropical Hardwood Sawn Timber — Export Grade",
    nameFr: "Bois Tropicaux Sciés — Grade Export",
    slug: "tropical-hardwood-sawn-timber-export",
    descriptionEn: "Premium export-grade sawn timber sourced from certified Cameroonian tropical forests. Available species include Tali, Iroko, Azobe, Doussié, Padouk, Movingui, Bibinga, Pachi and Teak in standard board and plank dimensions. All timber is kiln-dried, graded to EU/FLEGT standards, and shipped in sea containers. Suitable for construction, flooring, furniture manufacturing, decking, joinery and marine applications. Minimum order: 1 × 20ft container. FSC/FLEGT documentation available on request.",
    descriptionFr: "Bois sciés tropicaux de premier ordre issus de forêts camerounaises certifiées. Essences disponibles : Tali, Iroko, Azobé, Doussié, Padouk, Movingui, Bibinga, Pachi et Teck en dimensions planches et madriers standards. Tout le bois est séché en étuve, classé selon les normes UE/FLEGT et expédié en conteneurs maritimes. Adapté à la construction, parquet, menuiserie, bardage et applications marines. Commande minimum : 1 conteneur 20 pieds. Documentation FSC/FLEGT disponible sur demande.",
    imageUrl: "/uploads/media/tropical-timber-sawn-main.jpg",
    images: [
      "/uploads/media/tropical-timber-container.jpg",
      "/uploads/media/tropical-timber-blocks.jpg",
    ],
    categoryId: CAT.TIMBER,
    featured: true,
    specifications: JSON.stringify({
      origin: "Cameroon (FLEGT-licensed concessions)",
      species: "Tali, Iroko, Azobe, Doussié, Padouk, Movingui, Bibinga, Pachi, Teak",
      drying: "Kiln-dried",
      grading: "EU/FLEGT standards",
      minOrder: "1 × 20ft container",
      documentation: "FSC/FLEGT available on request",
    }),
  },
  {
    nameEn: "Certified Tropical Timber Logs — CVEFB Graded",
    nameFr: "Grumes Tropicales Certifiées — Classées CVEFB",
    slug: "certified-tropical-timber-logs-cvefb",
    descriptionEn: "CVEFB-certified round tropical timber logs sourced from licensed Cameroonian forest concessions. Each log is individually numbered, diameter-graded, and documented for full chain-of-custody traceability. Available species: Tali, Azobe, Iroko, Padouk, Doussié, Bibinga and others. Volume from 50 m³ per shipment. Logs are pre-measured, stamped and loaded on timber trucks for port delivery. Export documentation includes DFE/MINCOMMERCE permits, phytosanitary certificates and Bill of Lading.",
    descriptionFr: "Grumes tropicales rondes certifiées CVEFB, issues de concessions forestières camerounaises agréées. Chaque grume est numérotée individuellement, classée par diamètre et documentée pour une traçabilité complète. Essences disponibles : Tali, Azobé, Iroko, Padouk, Doussié, Bibinga et autres. Volume à partir de 50 m³ par expédition. Grumes pré-mesurées, estampillées et chargées sur camions grumiers pour livraison au port. Documentation : permis DFE/MINCOMMERCE, certificats phytosanitaires et connaissement.",
    imageUrl: "/uploads/media/tropical-logs-truck-main.jpg",
    images: [
      "/uploads/media/tropical-logs-forest-1.jpg",
      "/uploads/media/tropical-logs-forest-2.jpg",
      "/uploads/media/tropical-logs-truck-2.jpg",
    ],
    categoryId: CAT.TIMBER,
    featured: true,
    specifications: JSON.stringify({
      certification: "CVEFB (Cameroon Forest Exploitation Board)",
      origin: "Cameroon — licensed concessions",
      species: "Tali, Azobe, Iroko, Padouk, Doussié, Bibinga",
      minVolume: "50 m³ per shipment",
      grading: "Individual number, diameter-graded",
      documentation: "DFE/MINCOMMERCE permits, Phytosanitary cert, B/L",
    }),
  },
  {
    nameEn: "Alfalfa Hay — Premium Animal Feed",
    nameFr: "Foin de Luzerne — Aliment Animal Premium",
    slug: "alfalfa-hay-premium-animal-feed",
    descriptionEn: "Premium-quality alfalfa hay harvested at peak nutritional value and compressed into uniform rectangular bales for efficient transport and storage. High protein content (18–22%) with excellent digestibility — ideal feed for dairy cattle, horses, sheep, goats and other ruminants. Available in small bales (30 kg), jumbo bales (250 kg) and compressed export bales. Moisture content <12%, free from mold and field weeds. Phytosanitary certificate and fumigation treatment available for all export shipments.",
    descriptionFr: "Foin de luzerne premium, récolté au pic de sa valeur nutritive et compressé en balles rectangulaires uniformes pour un transport et stockage efficaces. Teneur en protéines élevée (18–22 %) avec excellente digestibilité — aliment idéal pour bovins laitiers, chevaux, moutons, chèvres et ruminants. Disponible en petites balles (30 kg), balles jumbo (250 kg) et balles compressées export. Humidité <12 %, sans moisissures ni mauvaises herbes. Certificat phytosanitaire et fumigation disponibles pour toutes expéditions export.",
    imageUrl: "/uploads/media/alfalfa-hay-warehouse-main.jpg",
    images: [
      "/uploads/media/alfalfa-hay-barn.jpg",
      "/uploads/media/alfalfa-hay-outdoor.jpg",
    ],
    categoryId: CAT.FOOD_AGRI,
    featured: true,
    specifications: JSON.stringify({
      protein: "18–22%",
      moisture: "< 12%",
      baleTypes: "Small (30 kg), Jumbo (250 kg), Compressed export",
      quality: "Free from mold and weeds",
      documentation: "Phytosanitary certificate, Fumigation available",
    }),
  },
];

async function main() {
  console.log("🔐 Logging in...");
  const loginRes = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });

  if (!loginRes.ok) {
    const err = await loginRes.text();
    console.error("❌ Login failed:", err);
    process.exit(1);
  }

  // Extract admin_jwt cookie from Set-Cookie header
  const setCookieHeader = loginRes.headers.get("set-cookie") || "";
  const cookieMatch = setCookieHeader.match(/admin_jwt=([^;]+)/);
  if (!cookieMatch) {
    console.error("❌ No admin_jwt cookie in response. Headers:", [...loginRes.headers.entries()]);
    process.exit(1);
  }
  const adminJwt = cookieMatch[1];
  console.log("✅ Logged in successfully\n");

  let created = 0;
  let skipped = 0;

  for (const product of PRODUCTS) {
    process.stdout.write(`📦 Adding: ${product.nameEn}... `);
    const res = await fetch(`${API}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `admin_jwt=${adminJwt}`,
      },
      body: JSON.stringify(product),
    });

    if (res.ok) {
      const data = await res.json();
      console.log(`✅ Created (id: ${data.id})`);
      created++;
    } else {
      const err = await res.json().catch(() => res.text());
      if (res.status === 409) {
        console.log(`⏭  Already exists — skipped`);
        skipped++;
      } else {
        console.log(`❌ Failed: ${JSON.stringify(err)}`);
      }
    }
  }

  console.log(`\n✅ Done — ${created} created, ${skipped} skipped`);
}

main().catch(console.error);
