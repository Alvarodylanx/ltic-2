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

  // Categories — idempotent
  await db.insert(categories).values([
    {
      nameEn: "Timber & Logs",
      nameFr: "Bois & Grumes",
      slug: "timber-logs",
      descriptionEn: "Premium certified tropical timber and logs for international markets",
      descriptionFr: "Bois tropicaux certifiés premium et grumes pour les marchés internationaux",
      imageUrl: "https://images.unsplash.com/photo-1542621334-a254cf47733d?w=800&auto=format&fit=crop&q=70",
    },
    {
      nameEn: "Industrial Generators",
      nameFr: "Groupes Électrogènes",
      slug: "generators",
      descriptionEn: "Diesel and gas generators for industrial and commercial use",
      descriptionFr: "Groupes électrogènes diesel et gaz pour usage industriel et commercial",
      imageUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&auto=format&fit=crop&q=70",
    },
    {
      nameEn: "Lubricants",
      nameFr: "Lubrifiants",
      slug: "lubricants",
      descriptionEn: "Total, Shell and OEM-grade industrial lubricants",
      descriptionFr: "Lubrifiants industriels Total, Shell et de qualité OEM",
      imageUrl: "https://images.unsplash.com/photo-1635859890085-ec8cb5466806?w=800&auto=format&fit=crop&q=70",
    },
    {
      nameEn: "Filters",
      nameFr: "Filtres",
      slug: "filters",
      descriptionEn: "Oil, air and industrial filters for all equipment types",
      descriptionFr: "Filtres à huile, à air et industriels pour tous types d'équipements",
      imageUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=70",
    },
    {
      nameEn: "General Industrial",
      nameFr: "Industriel Général",
      slug: "general-industrial",
      descriptionEn: "Heavy industrial materials and miscellaneous equipment",
      descriptionFr: "Matériaux industriels lourds et équipements divers",
      imageUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&auto=format&fit=crop&q=70",
    },
    {
      nameEn: "Marine & Maintenance Chemicals",
      nameFr: "Produits Chimiques Marins & Maintenance",
      slug: "marine-maintenance-chemicals",
      descriptionEn: "MARPOL-compliant marine chemicals, degreasers, and vessel maintenance products",
      descriptionFr: "Produits chimiques marins conformes MARPOL, dégraissants et produits d'entretien des navires",
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=70",
    },
    {
      nameEn: "Industrial Chemicals & Raw Materials",
      nameFr: "Produits Chimiques Industriels & Matières Premières",
      slug: "industrial-chemicals-raw-materials",
      descriptionEn: "Industrial-grade chemicals, solvents, surfactants, and raw materials for manufacturing",
      descriptionFr: "Produits chimiques industriels, solvants, tensioactifs et matières premières pour la fabrication",
      imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=70",
    },
    {
      nameEn: "Food & Agricultural Products",
      nameFr: "Produits Alimentaires & Agricoles",
      slug: "food-agricultural-products",
      descriptionEn: "Premium agri-food commodities, fertilizers, and agricultural inputs for export",
      descriptionFr: "Denrées agroalimentaires premium, engrais et intrants agricoles pour l'exportation",
      imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=70",
    },
  ]).onConflictDoNothing();

  const cats = await db.select().from(categories);
  console.log("Categories ready:", cats.length);

  const timberCat = cats.find(c => c.slug === "timber-logs")!;
  const genCat = cats.find(c => c.slug === "generators")!;
  const lubCat = cats.find(c => c.slug === "lubricants")!;
  const filterCat = cats.find(c => c.slug === "filters")!;
  const genIndustrial = cats.find(c => c.slug === "general-industrial")!;

  // Products
  await db.insert(products).values([
    // Timber
    {
      nameEn: "African Iroko Timber",
      nameFr: "Bois Iroko Africain",
      slug: "african-iroko-timber",
      descriptionEn: "High-quality African Iroko timber, ideal for construction and furniture manufacturing. Available in various dimensions.",
      descriptionFr: "Bois Iroko africain de haute qualité, idéal pour la construction et la fabrication de meubles.",
      categoryId: timberCat.id,
      imageUrl: "https://images.unsplash.com/photo-1542621334-a254cf47733d?w=800&auto=format&fit=crop&q=70",
      featured: true,
      available: true,
    },
    {
      nameEn: "Tropical Hardwood Logs",
      nameFr: "Grumes de Bois Dur Tropical",
      slug: "tropical-hardwood-logs",
      descriptionEn: "Premium tropical hardwood logs sourced from sustainably managed forests. Suitable for timber processing and export.",
      descriptionFr: "Grumes de bois dur tropical issues de forêts gérées durablement.",
      categoryId: timberCat.id,
      imageUrl: "https://images.unsplash.com/photo-1542621334-a254cf47733d?w=800&auto=format&fit=crop&q=70",
      featured: false,
      available: true,
    },
    {
      nameEn: "Teak Planks Export Grade",
      nameFr: "Planches de Teck Export",
      slug: "teak-planks-export",
      descriptionEn: "Export-grade teak planks, kiln-dried and treated. Ideal for marine, outdoor furniture, and luxury construction.",
      descriptionFr: "Planches de teck de qualité export, séchées au four et traitées.",
      categoryId: timberCat.id,
      imageUrl: "https://images.unsplash.com/photo-1542621334-a254cf47733d?w=800&auto=format&fit=crop&q=70",
      featured: true,
      available: true,
    },
    // Generators
    {
      nameEn: "50kVA Diesel Generator",
      nameFr: "Groupe Électrogène Diesel 50kVA",
      slug: "50kva-diesel-generator",
      descriptionEn: "Industrial-grade 50kVA diesel generator. Reliable power solution for commercial and industrial applications.",
      descriptionFr: "Groupe électrogène diesel 50kVA de qualité industrielle. Solution d'alimentation fiable.",
      categoryId: genCat.id,
      imageUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&auto=format&fit=crop&q=70",
      featured: true,
      available: true,
    },
    {
      nameEn: "100kVA Industrial Generator",
      nameFr: "Groupe Électrogène Industriel 100kVA",
      slug: "100kva-industrial-generator",
      descriptionEn: "Heavy-duty 100kVA industrial generator with automatic transfer switch. Perfect for medium-scale operations.",
      descriptionFr: "Groupe électrogène industriel 100kVA robuste avec commutateur de transfert automatique.",
      categoryId: genCat.id,
      imageUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&auto=format&fit=crop&q=70",
      featured: false,
      available: true,
    },
    {
      nameEn: "200kVA Standby Generator",
      nameFr: "Groupe Électrogène de Secours 200kVA",
      slug: "200kva-standby-generator",
      descriptionEn: "200kVA standby power generator with sound-attenuated enclosure. Ideal for hospitals, data centers, and large facilities.",
      descriptionFr: "Groupe électrogène de secours 200kVA avec enceinte atténuée. Idéal pour hôpitaux et centres de données.",
      categoryId: genCat.id,
      imageUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&auto=format&fit=crop&q=70",
      featured: true,
      available: true,
    },
    // Lubricants
    {
      nameEn: "Total Quartz Engine Oil 5W-40",
      nameFr: "Huile Moteur Total Quartz 5W-40",
      slug: "total-quartz-5w40",
      descriptionEn: "Premium synthetic engine oil for maximum engine protection. Suitable for petrol and diesel engines.",
      descriptionFr: "Huile moteur synthétique premium pour une protection maximale du moteur.",
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
      descriptionFr: "Huile moteur diesel Shell Rimula. Protection supérieure pour véhicules commerciaux.",
      categoryId: lubCat.id,
      imageUrl: "https://images.unsplash.com/photo-1635859890085-ec8cb5466806?w=800&auto=format&fit=crop&q=70",
      featured: false,
      available: true,
    },
    {
      nameEn: "Industrial Hydraulic Oil",
      nameFr: "Huile Hydraulique Industrielle",
      slug: "industrial-hydraulic-oil",
      descriptionEn: "High-performance hydraulic oil for industrial machinery and equipment. Available in ISO VG grades.",
      descriptionFr: "Huile hydraulique haute performance pour machines industrielles.",
      categoryId: lubCat.id,
      imageUrl: "https://images.unsplash.com/photo-1635859890085-ec8cb5466806?w=800&auto=format&fit=crop&q=70",
      featured: false,
      available: true,
    },
    // Filters
    {
      nameEn: "OEM Engine Oil Filter",
      nameFr: "Filtre à Huile Moteur OEM",
      slug: "oem-engine-oil-filter",
      descriptionEn: "OEM-specification engine oil filters compatible with major diesel and petrol engines. Bulk supply available.",
      descriptionFr: "Filtres à huile moteur de spécification OEM compatibles avec les principaux moteurs.",
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
      descriptionFr: "Éléments de filtre à air robustes pour groupes électrogènes et compresseurs.",
      categoryId: filterCat.id,
      imageUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=70",
      featured: false,
      available: true,
    },
    {
      nameEn: "Fuel Filter Assembly",
      nameFr: "Ensemble Filtre à Carburant",
      slug: "fuel-filter-assembly",
      descriptionEn: "Complete fuel filter assemblies for commercial vehicles and industrial equipment. Includes housing and element.",
      descriptionFr: "Ensembles complets de filtres à carburant pour véhicules commerciaux et équipements industriels.",
      categoryId: filterCat.id,
      imageUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=70",
      featured: false,
      available: true,
    },
    // General Industrial
    {
      nameEn: "Industrial Safety Equipment",
      nameFr: "Équipements de Sécurité Industrielle",
      slug: "industrial-safety-equipment",
      descriptionEn: "Comprehensive industrial safety equipment including PPE, hard hats, safety gloves, and protective gear.",
      descriptionFr: "Équipements de sécurité industrielle complets incluant EPI, casques et équipements de protection.",
      categoryId: genIndustrial.id,
      imageUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&auto=format&fit=crop&q=70",
      featured: false,
      available: true,
    },
    {
      nameEn: "Electrical Cable & Wire",
      nameFr: "Câbles et Fils Électriques",
      slug: "electrical-cable-wire",
      descriptionEn: "Industrial-grade electrical cables and wiring solutions. Available in various gauges and insulation ratings.",
      descriptionFr: "Câbles électriques industriels et solutions de câblage. Disponibles en différentes sections.",
      categoryId: genIndustrial.id,
      imageUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&auto=format&fit=crop&q=70",
      featured: false,
      available: true,
    },
    {
      nameEn: "Industrial Pumps & Valves",
      nameFr: "Pompes et Vannes Industrielles",
      slug: "industrial-pumps-valves",
      descriptionEn: "Centrifugal pumps, submersible pumps, and industrial valves for water, chemical, and petroleum applications.",
      descriptionFr: "Pompes centrifuges, pompes submersibles et vannes industrielles pour applications eau et pétrole.",
      categoryId: genIndustrial.id,
      imageUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&auto=format&fit=crop&q=70",
      featured: true,
      available: true,
    },
  ]).onConflictDoNothing();
  console.log("Products seeded: 15");

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
