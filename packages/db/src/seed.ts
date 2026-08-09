import { db } from "./index";
import { categories, products, orders, news, settings } from "./schema";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("Seeding database...");

  // Settings
  const settingsData = [
    { key: "social_facebook", value: "https://facebook.com/lticsarl" },
    { key: "social_twitter", value: "https://twitter.com/lticsarl" },
    { key: "social_linkedin", value: "https://linkedin.com/company/lticsarl" },
    { key: "social_instagram", value: "https://instagram.com/lticsarl" },
    { key: "social_youtube", value: "" },
    { key: "social_whatsapp", value: "https://wa.me/2376XXXXXXXX" },
    { key: "social_tiktok", value: "" },
  ];

  for (const s of settingsData) {
    await db.insert(settings).values(s).onConflictDoNothing();
  }
  console.log("Settings seeded");

  // Categories — new slugs are inserted; legacy slugs skipped via onConflictDoNothing
  await db.insert(categories).values([
    {
      nameEn: "Chemical Products",
      nameFr: "Produits Chimiques",
      slug: "chemical-products",
      descriptionEn: "ECOKLIN brand — bleach, degreasers, liquid soaps, muriatic acid and more. Manufactured at our PK13 factory in Douala.",
      descriptionFr: "Marque ECOKLIN — eau de javel, dégraissants, savons liquides, acide muriatique et plus. Fabriqués dans notre usine à PK13, Douala.",
      imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=70",
    },
    {
      nameEn: "Timber & Logs",
      nameFr: "Bois & Grumes",
      slug: "timber-logs",
      descriptionEn: "Certified tropical timber species — Tali, Iroko, Pachi, Movingui, Azobe, Doussié, Padou, Teak and Bibinga.",
      descriptionFr: "Essences tropicales certifiées — Tali, Iroko, Pachi, Movingui, Azobé, Doussié, Padou, Teck et Bibinga.",
      imageUrl: "https://images.unsplash.com/photo-1542621334-a254cf47733d?w=800&auto=format&fit=crop&q=70",
    },
    {
      nameEn: "Offshore & Maritime",
      nameFr: "Offshore & Maritime",
      slug: "offshore-maritime",
      descriptionEn: "Maritime supplies, ship chandling, vessel maintenance products and MARPOL-compliant marine chemicals.",
      descriptionFr: "Fournitures maritimes, avitaillement, produits de maintenance navires et produits chimiques marins conformes MARPOL.",
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=70",
    },
    {
      nameEn: "Lubricants Oil",
      nameFr: "Lubrifiants",
      slug: "lubricants",
      descriptionEn: "Total and Shell motor and vessel lubricants exclusively — engine oils, marine lubricants, hydraulic and gear oils.",
      descriptionFr: "Lubrifiants moteur et marine Total et Shell exclusivement — huiles moteur, lubrifiants marins, huiles hydrauliques et de boîte.",
      imageUrl: "https://images.unsplash.com/photo-1635859890085-ec8cb5466806?w=800&auto=format&fit=crop&q=70",
    },
    {
      nameEn: "Food & Agricultural Products",
      nameFr: "Produits Alimentaires & Agricoles",
      slug: "food-agricultural-products",
      descriptionEn: "Cocoa beans, coffee beans, peanut oil, bean seeds, corn (maïs), sesame and other agricultural commodities.",
      descriptionFr: "Graines de cacao, graines de café, huile d'arachide, graines de haricots, maïs, sésame et autres produits agricoles.",
      imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=70",
    },
    {
      nameEn: "Filters",
      nameFr: "Filtres",
      slug: "filters",
      descriptionEn: "Oil, air and fuel filters for all equipment types — OEM-grade for generators, engines and industrial machinery.",
      descriptionFr: "Filtres huile, air et carburant pour tous équipements — qualité OEM pour groupes électrogènes, moteurs et machines industrielles.",
      imageUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=70",
    },
    {
      nameEn: "Generators",
      nameFr: "Groupes Électrogènes",
      slug: "generators",
      descriptionEn: "Diesel and gas generators for industrial and commercial use — supplied across Central Africa and neighboring countries.",
      descriptionFr: "Groupes électrogènes diesel et gaz pour usage industriel et commercial — fournis en Afrique Centrale et dans les pays voisins.",
      imageUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&auto=format&fit=crop&q=70",
    },
    {
      nameEn: "Engines & Spare Parts",
      nameFr: "Moteurs & Pièces Détachées",
      slug: "spare-parts",
      descriptionEn: "Marine and industrial engines, spare parts and components for vessels and heavy equipment.",
      descriptionFr: "Moteurs maritimes et industriels, pièces de rechange et composants pour navires et équipements lourds.",
      imageUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&auto=format&fit=crop&q=70",
    },
  ]).onConflictDoNothing();

  const cats = await db.select().from(categories);
  console.log("Categories ready:", cats.length);

  const chemCat      = cats.find(c => c.slug === "chemical-products")!;
  const timberCat    = cats.find(c => c.slug === "timber-logs")!;
  const marineCat    = cats.find(c => c.slug === "offshore-maritime")!;
  const lubCat       = cats.find(c => c.slug === "lubricants")!;
  const foodCat      = cats.find(c => c.slug === "food-agricultural-products")!;
  const filterCat    = cats.find(c => c.slug === "filters")!;
  const genCat       = cats.find(c => c.slug === "generators")!;
  const sparesCat    = cats.find(c => c.slug === "spare-parts")!;

  // Products
  await db.insert(products).values([
    // ── ECOKLIN Chemical Products (PK13, Douala) ─────────────────────────
    {
      nameEn: "Bleach — Eau de Javel (ECOKLIN)",
      nameFr: "Eau de Javel ECOKLIN",
      slug: "ecoklin-eau-de-javel",
      descriptionEn: "ECOKLIN brand household and industrial bleach. Effective disinfectant and whitening agent. Available in 1L, 5L and bulk formats.",
      descriptionFr: "Eau de javel ménagère et industrielle marque ECOKLIN. Désinfectant et agent de blanchiment efficace. Disponible en 1L, 5L et en vrac.",
      categoryId: chemCat.id,
      imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=70",
      featured: true,
      available: true,
    },
    {
      nameEn: "Industrial Degreaser (ECOKLIN)",
      nameFr: "Dégraissant Industriel ECOKLIN",
      slug: "ecoklin-degraissant-industriel",
      descriptionEn: "ECOKLIN heavy-duty industrial degreaser for machinery, engines and workshop floors. Biodegradable formula.",
      descriptionFr: "Dégraissant industriel puissant ECOKLIN pour machines, moteurs et sols d'atelier. Formule biodégradable.",
      categoryId: chemCat.id,
      imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=70",
      featured: true,
      available: true,
    },
    {
      nameEn: "Descaler / Detartrant (ECOKLIN)",
      nameFr: "Détartrant ECOKLIN",
      slug: "ecoklin-detartrant",
      descriptionEn: "ECOKLIN descaler for limescale removal in pipes, boilers, sanitary ware and industrial equipment.",
      descriptionFr: "Détartrant ECOKLIN pour éliminer le tartre dans les tuyaux, chaudières, sanitaires et équipements industriels.",
      categoryId: chemCat.id,
      imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=70",
      featured: false,
      available: true,
    },
    {
      nameEn: "Tile Liquid Soap (ECOKLIN)",
      nameFr: "Savon Liquide Carreaux ECOKLIN",
      slug: "ecoklin-savon-carreaux",
      descriptionEn: "ECOKLIN liquid soap for tiles, floors and hard surfaces. Leaves a clean streak-free finish.",
      descriptionFr: "Savon liquide ECOKLIN pour carreaux, sols et surfaces dures. Laisse une finition propre sans traces.",
      categoryId: chemCat.id,
      imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=70",
      featured: false,
      available: true,
    },
    {
      nameEn: "Laundry Liquid Soap (ECOKLIN)",
      nameFr: "Savon Liquide Lessive ECOKLIN",
      slug: "ecoklin-savon-lessive",
      descriptionEn: "ECOKLIN liquid laundry soap — effective stain removal for household and commercial laundry.",
      descriptionFr: "Savon liquide lessive ECOKLIN — détachage efficace pour le linge ménager et professionnel.",
      categoryId: chemCat.id,
      imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=70",
      featured: false,
      available: true,
    },
    {
      nameEn: "Dish Washing Liquid (ECOKLIN)",
      nameFr: "Savon Liquide Vaisselle ECOKLIN",
      slug: "ecoklin-savon-vaisselle",
      descriptionEn: "ECOKLIN dish washing liquid — gentle on hands, tough on grease. For kitchens, restaurants and industrial use.",
      descriptionFr: "Liquide vaisselle ECOKLIN — doux pour les mains, efficace contre le gras. Pour cuisines, restaurants et usage industriel.",
      categoryId: chemCat.id,
      imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=70",
      featured: false,
      available: true,
    },
    {
      nameEn: "Muriatic Acid (ECOKLIN)",
      nameFr: "Acide Muriatique ECOKLIN",
      slug: "ecoklin-muriatic-acid",
      descriptionEn: "ECOKLIN muriatic acid (hydrochloric acid) for masonry cleaning, rust removal and industrial applications.",
      descriptionFr: "Acide muriatique ECOKLIN (acide chlorhydrique) pour nettoyage de maçonnerie, élimination de rouille et applications industrielles.",
      categoryId: chemCat.id,
      imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=70",
      featured: true,
      available: true,
    },
    // ── Timber & Logs ──────────────────────────────────────────────────────
    {
      nameEn: "Tali Timber",
      nameFr: "Bois Tali",
      slug: "timber-tali",
      descriptionEn: "Tali (Erythrophleum ivorense) — dense tropical hardwood prized for heavy construction, flooring and marine use.",
      descriptionFr: "Tali (Erythrophleum ivorense) — bois dur tropical dense, prisé pour la construction lourde, le parquet et l'usage maritime.",
      categoryId: timberCat.id,
      imageUrl: "https://images.unsplash.com/photo-1542621334-a254cf47733d?w=800&auto=format&fit=crop&q=70",
      featured: true,
      available: true,
    },
    {
      nameEn: "Iroko Timber",
      nameFr: "Bois Iroko",
      slug: "timber-iroko",
      descriptionEn: "Iroko — prized African hardwood, a durable teak alternative. Ideal for furniture, joinery and outdoor decking.",
      descriptionFr: "Iroko — précieux bois dur africain, alternative durable au teck. Idéal pour meubles, menuiserie et terrasses extérieures.",
      categoryId: timberCat.id,
      imageUrl: "https://images.unsplash.com/photo-1542621334-a254cf47733d?w=800&auto=format&fit=crop&q=70",
      featured: true,
      available: true,
    },
    {
      nameEn: "Pachi Timber",
      nameFr: "Bois Pachi",
      slug: "timber-pachi",
      descriptionEn: "Pachi — light-coloured tropical hardwood used in construction, panelling and furniture manufacturing.",
      descriptionFr: "Pachi — bois dur tropical clair utilisé en construction, revêtement mural et fabrication de meubles.",
      categoryId: timberCat.id,
      imageUrl: "https://images.unsplash.com/photo-1542621334-a254cf47733d?w=800&auto=format&fit=crop&q=70",
      featured: false,
      available: true,
    },
    {
      nameEn: "Azobe Timber",
      nameFr: "Bois Azobé",
      slug: "timber-azobe",
      descriptionEn: "Azobe (Lophira alata) — one of the hardest African woods. Used in heavy civil works, railway sleepers and marine pilings.",
      descriptionFr: "Azobé (Lophira alata) — l'un des bois africains les plus durs. Utilisé en génie civil lourd, traverses ferroviaires et pieux maritimes.",
      categoryId: timberCat.id,
      imageUrl: "https://images.unsplash.com/photo-1542621334-a254cf47733d?w=800&auto=format&fit=crop&q=70",
      featured: true,
      available: true,
    },
    {
      nameEn: "Teak (Tek) Timber",
      nameFr: "Bois Teck (Tek)",
      slug: "timber-teak",
      descriptionEn: "Teak — premium tropical hardwood with natural oil content. Superior for marine decking, outdoor furniture and luxury joinery.",
      descriptionFr: "Teck — bois dur tropical premium à haute teneur en huile naturelle. Supérieur pour ponts marins, meubles extérieurs et menuiserie de luxe.",
      categoryId: timberCat.id,
      imageUrl: "https://images.unsplash.com/photo-1542621334-a254cf47733d?w=800&auto=format&fit=crop&q=70",
      featured: false,
      available: true,
    },
    // ── Offshore & Maritime ────────────────────────────────────────────────
    {
      nameEn: "Marine Degreaser (MARPOL-Compliant)",
      nameFr: "Dégraissant Marin (Conforme MARPOL)",
      slug: "marine-degreaser",
      descriptionEn: "MARPOL-compliant marine degreaser for vessel cleaning, bilge cleaning and tank degreasing operations.",
      descriptionFr: "Dégraissant marin conforme MARPOL pour le nettoyage des navires, des cales et le dégraissage des réservoirs.",
      categoryId: marineCat.id,
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=70",
      featured: true,
      available: true,
    },
    {
      nameEn: "Ship Chandling Provisions & Stores",
      nameFr: "Provisions et Magasin de Bord",
      slug: "ship-chandling-provisions",
      descriptionEn: "Full ship chandling service — provisions, deck and engine stores, safety equipment and consumables for vessels calling at Douala and Gulf of Guinea ports.",
      descriptionFr: "Service complet d'avitaillement — provisions, matériel de pont et machine, équipements de sécurité et consommables pour navires faisant escale à Douala et dans le Golfe de Guinée.",
      categoryId: marineCat.id,
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=70",
      featured: true,
      available: true,
    },
    // ── Lubricants ─────────────────────────────────────────────────────────
    {
      nameEn: "Total Quartz Engine Oil 5W-40",
      nameFr: "Huile Moteur Total Quartz 5W-40",
      slug: "total-quartz-5w40",
      descriptionEn: "Premium synthetic engine oil for maximum engine protection. Suitable for petrol and diesel engines.",
      descriptionFr: "Huile moteur synthétique premium pour une protection maximale du moteur. Convient aux moteurs essence et diesel.",
      categoryId: lubCat.id,
      imageUrl: "https://images.unsplash.com/photo-1635859890085-ec8cb5466806?w=800&auto=format&fit=crop&q=70",
      featured: true,
      available: true,
    },
    {
      nameEn: "Shell Rimula Heavy Duty Diesel Oil",
      nameFr: "Huile Diesel Shell Rimula",
      slug: "shell-rimula-diesel-oil",
      descriptionEn: "Shell Rimula heavy-duty diesel engine oil. Provides superior protection for commercial vehicles and industrial engines.",
      descriptionFr: "Huile moteur diesel Shell Rimula. Protection supérieure pour véhicules commerciaux et moteurs industriels.",
      categoryId: lubCat.id,
      imageUrl: "https://images.unsplash.com/photo-1635859890085-ec8cb5466806?w=800&auto=format&fit=crop&q=70",
      featured: false,
      available: true,
    },
    {
      nameEn: "Marine Lubricant — Cylinder Oil",
      nameFr: "Lubrifiant Marin — Huile Cylindre",
      slug: "marine-cylinder-oil",
      descriptionEn: "High-performance marine cylinder oil for two-stroke and four-stroke vessel engines. Suitable for vessels operating in the Gulf of Guinea.",
      descriptionFr: "Huile cylindre marine haute performance pour moteurs de navires deux et quatre temps. Adaptée aux navires opérant dans le Golfe de Guinée.",
      categoryId: lubCat.id,
      imageUrl: "https://images.unsplash.com/photo-1635859890085-ec8cb5466806?w=800&auto=format&fit=crop&q=70",
      featured: true,
      available: true,
    },
    // ── Food & Agricultural ────────────────────────────────────────────────
    {
      nameEn: "Cocoa Beans (Graines de Cacao)",
      nameFr: "Graines de Cacao",
      slug: "cocoa-beans",
      descriptionEn: "Premium Cameroonian cocoa beans — dried and fermented, export-grade, sourced directly from local producers.",
      descriptionFr: "Graines de cacao camerounaises premium — séchées et fermentées, qualité export, sourcées directement auprès des producteurs locaux.",
      categoryId: foodCat.id,
      imageUrl: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=800&auto=format&fit=crop&q=70",
      featured: true,
      available: true,
    },
    {
      nameEn: "Coffee Beans (Graines de Café)",
      nameFr: "Graines de Café",
      slug: "coffee-beans",
      descriptionEn: "Cameroonian coffee beans — Arabica and Robusta varieties, export-grade. Known for their rich flavour profile.",
      descriptionFr: "Graines de café camerounaises — variétés Arabica et Robusta, qualité export. Connues pour leur profil aromatique riche.",
      categoryId: foodCat.id,
      imageUrl: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&auto=format&fit=crop&q=70",
      featured: true,
      available: true,
    },
    {
      nameEn: "Peanut Oil (Huile d'Arachide)",
      nameFr: "Huile d'Arachide",
      slug: "peanut-oil",
      descriptionEn: "Refined peanut oil — available in various formats (1L, 5L, 25L, bulk). For food use, cooking and commercial distribution.",
      descriptionFr: "Huile d'arachide raffinée — disponible en différents formats (1L, 5L, 25L, vrac). Pour usage alimentaire, cuisson et distribution commerciale.",
      categoryId: foodCat.id,
      imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&auto=format&fit=crop&q=70",
      featured: false,
      available: true,
    },
    {
      nameEn: "Bean Seeds (Graines de Haricots)",
      nameFr: "Graines de Haricots",
      slug: "bean-seeds",
      descriptionEn: "Bean seeds — white, red and mixed varieties. Available in bulk for regional markets and export.",
      descriptionFr: "Graines de haricots — variétés blanches, rouges et mélangées. Disponibles en vrac pour marchés régionaux et export.",
      categoryId: foodCat.id,
      imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&auto=format&fit=crop&q=70",
      featured: false,
      available: true,
    },
    {
      nameEn: "Corn / Maïs",
      nameFr: "Maïs",
      slug: "corn-mais",
      descriptionEn: "Dried corn (maïs) — whole grain and milled. Sourced from Cameroonian farms, available for bulk purchase.",
      descriptionFr: "Maïs séché — grain entier et moulu. Disponible en achat en vrac pour marchés régionaux et export.",
      categoryId: foodCat.id,
      imageUrl: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&auto=format&fit=crop&q=70",
      featured: false,
      available: true,
    },
    {
      nameEn: "Sesame Seeds",
      nameFr: "Graines de Sésame",
      slug: "sesame-seeds",
      descriptionEn: "Natural sesame seeds — hulled and unhulled varieties. High-quality, export-ready, sourced from Cameroonian producers.",
      descriptionFr: "Graines de sésame naturelles — variétés décortiquées et non décortiquées. Haute qualité, prêtes à l'export, issues de producteurs camerounais.",
      categoryId: foodCat.id,
      imageUrl: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=800&auto=format&fit=crop&q=70",
      featured: false,
      available: true,
    },
    // ── Filters ────────────────────────────────────────────────────────────
    {
      nameEn: "OEM Engine Oil Filter",
      nameFr: "Filtre à Huile Moteur OEM",
      slug: "oem-engine-oil-filter",
      descriptionEn: "OEM-specification engine oil filters compatible with major diesel and petrol engines. Bulk supply available.",
      descriptionFr: "Filtres à huile moteur de spécification OEM compatibles avec les principaux moteurs. Fourniture en vrac disponible.",
      categoryId: filterCat.id,
      imageUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=70",
      featured: false,
      available: true,
    },
    {
      nameEn: "Industrial Air Filter Element",
      nameFr: "Élément de Filtre à Air Industriel",
      slug: "industrial-air-filter",
      descriptionEn: "Heavy-duty air filter elements for generators, compressors, and industrial engines. Multi-brand compatibility.",
      descriptionFr: "Éléments de filtre à air robustes pour groupes électrogènes, compresseurs et moteurs industriels.",
      categoryId: filterCat.id,
      imageUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=70",
      featured: false,
      available: true,
    },
    {
      nameEn: "Fuel Filter Assembly",
      nameFr: "Ensemble Filtre à Carburant",
      slug: "fuel-filter-assembly",
      descriptionEn: "Complete fuel filter assemblies for commercial vehicles and industrial equipment.",
      descriptionFr: "Ensembles complets de filtres à carburant pour véhicules commerciaux et équipements industriels.",
      categoryId: filterCat.id,
      imageUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=70",
      featured: false,
      available: true,
    },
    // ── Generators ─────────────────────────────────────────────────────────
    {
      nameEn: "50kVA Diesel Generator",
      nameFr: "Groupe Électrogène Diesel 50kVA",
      slug: "50kva-diesel-generator",
      descriptionEn: "50kVA diesel generator for commercial and industrial applications. Supplied across Central Africa and neighboring countries.",
      descriptionFr: "Groupe électrogène diesel 50kVA pour applications commerciales et industrielles. Fourni en Afrique Centrale et dans les pays voisins.",
      categoryId: genCat.id,
      imageUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&auto=format&fit=crop&q=70",
      featured: true,
      available: true,
    },
    {
      nameEn: "100kVA Industrial Generator",
      nameFr: "Groupe Électrogène Industriel 100kVA",
      slug: "100kva-industrial-generator",
      descriptionEn: "Heavy-duty 100kVA industrial generator with automatic transfer switch.",
      descriptionFr: "Groupe électrogène industriel 100kVA robuste avec commutateur de transfert automatique.",
      categoryId: genCat.id,
      imageUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&auto=format&fit=crop&q=70",
      featured: false,
      available: true,
    },
    // ── Engines & Spare Parts ──────────────────────────────────────────────
    {
      nameEn: "Marine Engine Spare Parts",
      nameFr: "Pièces Détachées Moteur Marin",
      slug: "marine-engine-spare-parts",
      descriptionEn: "Spare parts for marine engines — pistons, gaskets, injectors, pumps and more. Sourced for vessels operating in African waters.",
      descriptionFr: "Pièces détachées pour moteurs marins — pistons, joints, injecteurs, pompes et plus. Approvisionnées pour navires opérant dans les eaux africaines.",
      categoryId: sparesCat.id,
      imageUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&auto=format&fit=crop&q=70",
      featured: true,
      available: true,
    },
    {
      nameEn: "Industrial Engine & Pump Parts",
      nameFr: "Pièces Moteurs Industriels & Pompes",
      slug: "industrial-engine-parts",
      descriptionEn: "Industrial engine components and pump parts for generators, compressors and heavy equipment.",
      descriptionFr: "Composants de moteurs industriels et pièces de pompes pour groupes électrogènes, compresseurs et équipements lourds.",
      categoryId: sparesCat.id,
      imageUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&auto=format&fit=crop&q=70",
      featured: false,
      available: true,
    },
  ]).onConflictDoNothing();
  console.log("Products seeded: 29");

  // Demo order — idempotent
  await db.insert(orders).values({
    trackingNumber: "TRK-2024-001",
    clientName: "Demo Client",
    clientEmail: "demo@example.com",
    origin: "Douala, Cameroon",
    destination: "Rotterdam, Netherlands",
    description: "Timber logs — 40ft container, 25 MT",
    status: "in-transit",
    estimatedDelivery: "2024-12-20",
    timeline: [
      {
        status: "processing",
        date: "2024-11-15T08:00:00Z",
        description: "Shipment registered and documentation prepared",
        location: "Douala, Cameroon",
      },
      {
        status: "customs-cleared",
        date: "2024-11-18T14:30:00Z",
        description: "Customs clearance completed, cargo loaded",
        location: "Port of Douala",
      },
      {
        status: "in-transit",
        date: "2024-11-20T09:00:00Z",
        description: "Vessel departed. ETA Rotterdam: Dec 20, 2024",
        location: "Atlantic Ocean",
      },
    ],
  }).onConflictDoNothing();
  console.log("Demo order seeded");

  // News
  await db.insert(news).values([
    {
      titleEn: "LTIC SARL Expands Operations to 5 New Countries",
      titleFr: "LTIC SARL Étend ses Activités à 5 Nouveaux Pays",
      slug: "ltic-expands-5-new-countries",
      summaryEn: "LTIC SARL announces strategic expansion into new markets in West Africa and Southeast Asia, reinforcing its position as a leading multinational logistics provider.",
      summaryFr: "LTIC SARL annonce une expansion stratégique vers de nouveaux marchés en Afrique de l'Ouest et en Asie du Sud-Est.",
      contentEn: `LTIC SARL is proud to announce the expansion of its operations into five new countries, including Senegal, Côte d'Ivoire, Ghana, Vietnam, and Indonesia. This strategic move reinforces the company's commitment to providing world-class logistics and industrial supply solutions across emerging markets.

The expansion follows strong growth in existing markets and increasing demand from international clients seeking reliable logistics partners in these regions. LTIC SARL will establish dedicated offices and partner networks in each new market, ensuring local expertise combined with global operational standards.

"This expansion represents a significant milestone in LTIC SARL's growth journey," said the Operations Director. "We are committed to bringing our full suite of logistics, industrial supply, and trade facilitation services to businesses in these dynamic markets."

The new operations will focus on freight forwarding, customs clearance, industrial supply, and supply chain consulting services. LTIC SARL's established partnerships with Total, Shell, and leading OEM brands will be extended to these new markets, ensuring clients have access to premium industrial products and lubricants.`,
      contentFr: `LTIC SARL est fière d'annoncer l'expansion de ses activités dans cinq nouveaux pays, dont le Sénégal, la Côte d'Ivoire, le Ghana, le Vietnam et l'Indonésie.

Cette démarche stratégique renforce l'engagement de l'entreprise à fournir des solutions logistiques et d'approvisionnement industriel de classe mondiale sur les marchés émergents.

L'expansion fait suite à une forte croissance sur les marchés existants et à une demande croissante de la part de clients internationaux.`,
      imageUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=70",
      category: "Company News",
      published: true,
    },
    {
      titleEn: "Understanding Phytosanitary Requirements for Timber Export",
      titleFr: "Comprendre les Exigences Phytosanitaires pour l'Export de Bois",
      slug: "phytosanitary-requirements-timber-export",
      summaryEn: "A comprehensive guide to international phytosanitary regulations for timber and wood products export, with practical compliance advice for exporters.",
      summaryFr: "Un guide complet sur les réglementations phytosanitaires internationales pour l'exportation de bois et produits dérivés.",
      contentEn: `International timber trade is subject to strict phytosanitary regulations designed to prevent the spread of pests, diseases, and invasive species across borders. Understanding and complying with these requirements is essential for successful timber export operations.

**Key Phytosanitary Requirements**

Most importing countries require that wood packaging material (WPM) and timber products meet the ISPM 15 standard, which requires heat treatment (HT) or methyl bromide fumigation (MB) to eliminate pests. Treatment must be carried out by authorized facilities and documented with official marking.

**Documentation Requirements**

Exporters must obtain a Phytosanitary Certificate from the national plant protection organization (NPPO) in the country of origin. This certificate confirms that the timber has been inspected and meets the phytosanitary requirements of the importing country.

**LTIC SARL's Compliance Services**

LTIC SARL offers comprehensive phytosanitary treatment and certification services for timber exporters. Our team coordinates with authorized treatment facilities and national authorities to ensure full compliance with importing country requirements, minimizing delays and ensuring smooth cargo clearance.`,
      contentFr: `Le commerce international du bois est soumis à des réglementations phytosanitaires strictes conçues pour prévenir la propagation de ravageurs et de maladies.

**Principales exigences phytosanitaires**

La plupart des pays importateurs exigent que les emballages en bois et les produits en bois répondent à la norme NIMP 15.

**Services de conformité LTIC SARL**

LTIC SARL offre des services complets de traitement phytosanitaire et de certification pour les exportateurs de bois.`,
      imageUrl: "https://images.unsplash.com/photo-1542621334-a254cf47733d?w=800&auto=format&fit=crop&q=70",
      category: "Industry Insights",
      published: true,
    },
  ]).onConflictDoNothing();
  console.log("News articles seeded");

  console.log("Database seeded successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
