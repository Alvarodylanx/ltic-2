/**
 * Run: node add-timber-species.mjs
 * Adds 9 individual tropical timber species as separate products.
 */

const API = "http://localhost:4000/api";
const EMAIL = "alvarodylan10@gmail.com";
const PASSWORD = "655197772a";
const CAT_TIMBER = 1;

// Shared gallery images (real LTIC photos)
const SAWN_IMAGES = [
  "/uploads/media/tropical-timber-sawn-main.jpg",
  "/uploads/media/tropical-timber-container.jpg",
  "/uploads/media/tropical-timber-blocks.jpg",
];
const LOG_IMAGES = [
  "/uploads/media/tropical-logs-truck-main.jpg",
  "/uploads/media/tropical-logs-forest-1.jpg",
  "/uploads/media/tropical-logs-forest-2.jpg",
  "/uploads/media/tropical-logs-truck-2.jpg",
];

const TIMBER_SPECIES = [
  {
    nameEn: "Tali — Tropical Hardwood",
    nameFr: "Tali — Bois Tropical Dur",
    slug: "tali-tropical-hardwood",
    descriptionEn: "Tali (Erythrophleum suaveolens) is one of the hardest and heaviest African tropical timbers, prized for its outstanding durability and natural resistance to insects and fungi. Reddish-brown to dark brown heartwood with an interlocked or wavy grain. Class I natural durability. Widely used for heavy construction, marine piling, railway sleepers, flooring, and exterior joinery. Exported from Cameroon in both round log and sawn lumber form. FLEGT/FSC documentation available.",
    descriptionFr: "Le Tali (Erythrophleum suaveolens) est l'un des bois tropicaux africains les plus durs et les plus lourds, prisé pour sa durabilité exceptionnelle et sa résistance naturelle aux insectes et champignons. Bois de cœur brun rougeâtre à brun foncé avec un fil entrecroisé ou ondulé. Classe I de durabilité naturelle. Très utilisé pour la construction lourde, les pilotis marins, les traverses de chemin de fer, les parquets et la menuiserie extérieure. Exporté depuis le Cameroun en grumes et en bois sciés. Documentation FLEGT/FSC disponible.",
    imageUrl: SAWN_IMAGES[0],
    images: [...SAWN_IMAGES.slice(1), ...LOG_IMAGES.slice(0, 2)],
    specifications: { species: "Erythrophleum suaveolens", origin: "Cameroon", durabilityClass: "Class I", density: "950–1050 kg/m³", use: "Heavy construction, Marine, Railway sleepers, Flooring" },
    featured: true,
  },
  {
    nameEn: "Iroko — African Teak",
    nameFr: "Iroko — Teck Africain",
    slug: "iroko-african-teak",
    descriptionEn: "Iroko (Milicia excelsa) is one of Africa's most commercially important tropical hardwoods, often called 'African Teak' for its similar properties to genuine teak at a more accessible price point. Yellow-brown to golden-brown heartwood with a coarse, often interlocked grain. Class II natural durability. Excellent workability and stability. Widely used for furniture, interior and exterior joinery, flooring, boat building, and decorative veneers. Sustainably sourced from certified Cameroonian forests.",
    descriptionFr: "L'Iroko (Milicia excelsa) est l'un des bois tropicaux africains les plus importants commercialement, souvent surnommé 'Teck Africain' pour ses propriétés similaires au vrai teck à un prix plus accessible. Bois de cœur brun jaune à brun doré avec un fil grossier souvent entrecroisé. Classe II de durabilité naturelle. Excellente aptitude au travail et stabilité. Très utilisé pour le mobilier, la menuiserie intérieure et extérieure, les parquets, la construction navale et les placages décoratifs. Issu de forêts camerounaises certifiées.",
    imageUrl: SAWN_IMAGES[1],
    images: [SAWN_IMAGES[0], SAWN_IMAGES[2], ...LOG_IMAGES.slice(0, 2)],
    specifications: { species: "Milicia excelsa", origin: "Cameroon", durabilityClass: "Class II", density: "640–720 kg/m³", use: "Furniture, Joinery, Flooring, Boat building, Veneers" },
    featured: true,
  },
  {
    nameEn: "Pachi — Cameroonian Hardwood",
    nameFr: "Pachi — Bois Dur Camerounais",
    slug: "pachi-cameroonian-hardwood",
    descriptionEn: "Pachi is a dense, high-quality Cameroonian tropical hardwood known for its strength, stability, and rich reddish-brown color. It offers excellent mechanical properties making it suitable for structural applications, heavy flooring, exterior decking, and industrial uses. A reliable choice for demanding construction and export markets. Available in round log and sawn lumber form from certified forest concessions in Cameroon. Competitive pricing for large volumes.",
    descriptionFr: "Le Pachi est un bois tropical camerounais dense et de haute qualité, reconnu pour sa robustesse, sa stabilité et sa couleur brun rougeâtre riche. Il offre d'excellentes propriétés mécaniques pour les applications structurelles, les parquets lourds, les terrasses extérieures et les usages industriels. Un choix fiable pour les marchés de la construction exigeante et de l'exportation. Disponible en grumes et bois sciés issus de concessions forestières certifiées au Cameroun. Prix compétitifs pour les grands volumes.",
    imageUrl: LOG_IMAGES[1],
    images: [LOG_IMAGES[0], LOG_IMAGES[2], SAWN_IMAGES[0]],
    specifications: { species: "Pachi spp.", origin: "Cameroon", durabilityClass: "Class II", density: "700–800 kg/m³", use: "Structural, Heavy flooring, Decking, Industrial" },
    featured: false,
  },
  {
    nameEn: "Movingui — African Satinwood",
    nameFr: "Movingui — Satiné Africain",
    slug: "movingui-african-satinwood",
    descriptionEn: "Movingui (Distemonanthus benthamianus), also known as African Satinwood or Nigerian Satinwood, is a fine-grained decorative hardwood with a luminous yellow to golden-yellow color and a silky luster. Light to medium density with a typically straight or slightly interlocked grain. Class III natural durability. Its attractive appearance makes it highly sought after for furniture, interior paneling, decorative veneers, cabinetry, and high-end joinery. Exported in lumber and veneer log form from Cameroon.",
    descriptionFr: "Le Movingui (Distemonanthus benthamianus), aussi connu sous le nom de Satiné Africain ou Satiné Nigérian, est un bois décoratif à grain fin avec une couleur jaune lumineuse à jaune dorée et un lustre soyeux. Densité légère à moyenne avec un fil généralement droit ou légèrement entrecroisé. Classe III de durabilité naturelle. Son aspect attrayant le rend très recherché pour le mobilier, les lambris intérieurs, les placages décoratifs, l'ébénisterie et la menuiserie haut de gamme. Exporté en bois sciés et grumes à plaquer depuis le Cameroun.",
    imageUrl: SAWN_IMAGES[2],
    images: [SAWN_IMAGES[0], SAWN_IMAGES[1], LOG_IMAGES[0]],
    specifications: { species: "Distemonanthus benthamianus", origin: "Cameroon", durabilityClass: "Class III", density: "580–680 kg/m³", use: "Furniture, Decorative veneers, Cabinetry, Interior paneling" },
    featured: false,
  },
  {
    nameEn: "Azobe — African Ironwood",
    nameFr: "Azobé — Bois de Fer Africain",
    slug: "azobe-african-ironwood",
    descriptionEn: "Azobe (Lophira alata), commonly called African Ironwood or Bongossi, is one of the heaviest and most durable tropical hardwoods in the world. Dark reddish-brown heartwood, extremely hard and dense, with outstanding resistance to mechanical stress, moisture and marine borers. Class I natural durability — suitable for permanent outdoor and underwater use without treatment. Preferred for harbor works, heavy bridge construction, railway sleepers, marine piling, and foundation works. Certified origin from Cameroon.",
    descriptionFr: "L'Azobé (Lophira alata), communément appelé Bois de Fer Africain ou Bongossi, est l'un des bois tropicaux les plus lourds et les plus durables au monde. Bois de cœur brun rougeâtre foncé, extrêmement dur et dense, avec une résistance exceptionnelle aux contraintes mécaniques, à l'humidité et aux térébrants marins. Classe I de durabilité naturelle — utilisable en extérieur permanent et sous-marin sans traitement. Privilégié pour les ouvrages portuaires, la construction de ponts lourds, les traverses ferroviaires, les pilotis marins et les travaux de fondation. Origine certifiée du Cameroun.",
    imageUrl: LOG_IMAGES[0],
    images: [LOG_IMAGES[1], LOG_IMAGES[2], LOG_IMAGES[3]],
    specifications: { species: "Lophira alata", origin: "Cameroon", durabilityClass: "Class I", density: "950–1100 kg/m³", use: "Harbor works, Bridge construction, Railway sleepers, Marine piling" },
    featured: true,
  },
  {
    nameEn: "Doussié — Cameroonian Hardwood",
    nameFr: "Doussié — Bois Camerounais",
    slug: "doussie-cameroonian-hardwood",
    descriptionEn: "Doussié (Afzelia bipindensis) is a premium tropical hardwood from Cameroon, recognized for its rich golden-brown to reddish-brown color, excellent dimensional stability, and natural durability. Medium to high density with an interlocked grain that gives it a characteristic ribbon figure on quartersawn faces. Class I natural durability. Highly valued for luxury flooring, high-end furniture, exterior joinery, and architectural woodwork. A sustainable choice when sourced from FLEGT-licensed concessions. Available in sawn lumber and round logs.",
    descriptionFr: "Le Doussié (Afzelia bipindensis) est un bois tropical premium du Cameroun, reconnu pour sa couleur brun doré à brun rougeâtre riche, son excellente stabilité dimensionnelle et sa durabilité naturelle. Densité moyenne à élevée avec un fil entrecroisé qui lui confère un miroitement caractéristique sur les faces sur quartier. Classe I de durabilité naturelle. Très prisé pour les parquets de luxe, le mobilier haut de gamme, la menuiserie extérieure et les travaux architecturaux en bois. Choix durable issu de concessions agréées FLEGT. Disponible en bois sciés et grumes.",
    imageUrl: SAWN_IMAGES[0],
    images: [LOG_IMAGES[0], LOG_IMAGES[1], SAWN_IMAGES[1]],
    specifications: { species: "Afzelia bipindensis", origin: "Cameroon", durabilityClass: "Class I", density: "780–900 kg/m³", use: "Luxury flooring, Furniture, Exterior joinery, Architectural woodwork" },
    featured: true,
  },
  {
    nameEn: "Padouk — African Padauk",
    nameFr: "Padouk — Padouk Africain",
    slug: "padouk-african-padauk",
    descriptionEn: "Padouk (Pterocarpus soyauxii), also known as African Padauk or Camwood, is a striking tropical hardwood famous for its vivid red to red-orange heartwood that mellows to a rich reddish-brown over time. Straight to interlocked grain with a coarse texture and a natural luster. Class II natural durability. Excellent strength-to-weight ratio. Used in fine furniture, decorative flooring, turning, musical instrument components, and high-end interior joinery. Iconic and highly recognizable in global timber markets.",
    descriptionFr: "Le Padouk (Pterocarpus soyauxii), aussi connu sous le nom de Padouk Africain ou Camwood, est un remarquable bois tropical célèbre pour son bois de cœur rouge vif à rouge-orangé qui se patine en brun rougeâtre riche avec le temps. Fil droit à entrecroisé avec une texture grossière et un lustre naturel. Classe II de durabilité naturelle. Excellent rapport résistance/poids. Utilisé dans les meubles de qualité, les parquets décoratifs, le tournage, les composants d'instruments de musique et la menuiserie intérieure haut de gamme. Iconique et très reconnaissable sur les marchés mondiaux du bois.",
    imageUrl: LOG_IMAGES[2],
    images: [LOG_IMAGES[0], LOG_IMAGES[3], SAWN_IMAGES[0]],
    specifications: { species: "Pterocarpus soyauxii", origin: "Cameroon", durabilityClass: "Class II", density: "700–800 kg/m³", use: "Fine furniture, Decorative flooring, Musical instruments, Interior joinery" },
    featured: false,
  },
  {
    nameEn: "Teak — African Teak (Tek)",
    nameFr: "Teck — Teck Africain (Tek)",
    slug: "teak-african-tek",
    descriptionEn: "African Teak (Tectona grandis / local species), known locally as Tek, is a premier tropical hardwood prized worldwide for its exceptional durability, natural oil content and weather resistance. Straight-grained with a coarse, uneven texture and a golden-brown to dark brown color. Class I natural durability — performs exceptionally well in outdoor and marine environments without surface treatment. The benchmark material for high-end outdoor furniture, yacht decking, marine construction, doors, windows, and fine joinery.",
    descriptionFr: "Le Teck Africain (Tectona grandis / espèce locale), connu localement sous le nom de Tek, est un bois tropical de premier ordre prisé mondialement pour sa durabilité exceptionnelle, sa teneur naturelle en huile et sa résistance aux intempéries. Fil droit avec une texture grossière et irrégulière et une couleur brun doré à brun foncé. Classe I de durabilité naturelle — performant exceptionnellement bien en extérieur et en milieu marin sans traitement de surface. Le matériau de référence pour les meubles d'extérieur haut de gamme, les terrasses de yachts, la construction maritime, les portes, fenêtres et menuiseries de qualité.",
    imageUrl: SAWN_IMAGES[1],
    images: [SAWN_IMAGES[0], SAWN_IMAGES[2], LOG_IMAGES[1]],
    specifications: { species: "Tectona grandis / local spp.", origin: "Cameroon", durabilityClass: "Class I", density: "630–720 kg/m³", use: "Outdoor furniture, Yacht decking, Marine construction, Fine joinery" },
    featured: true,
  },
  {
    nameEn: "Bibinga — Cameroonian Hardwood",
    nameFr: "Bibinga — Bois Dur Camerounais",
    slug: "bibinga-cameroonian-hardwood",
    descriptionEn: "Bibinga is a quality Cameroonian tropical hardwood valued for its warm reddish-brown tones, good workability and moderate to high natural durability. Medium density with a straight to slightly interlocked grain, Bibinga presents attractive figure and finishes well. Suitable for furniture manufacturing, interior paneling, doors, flooring and general construction uses. It offers a cost-effective alternative to higher-priced premium species while maintaining reliable quality for export markets.",
    descriptionFr: "Le Bibinga est un bois tropical camerounais de qualité apprécié pour ses tons brun rougeâtre chauds, sa bonne aptitude au travail et sa durabilité naturelle modérée à élevée. Densité moyenne avec un fil droit à légèrement entrecroisé, le Bibinga présente une figure attrayante et se finit bien. Adapté à la fabrication de mobilier, aux lambris intérieurs, aux portes, aux parquets et aux usages de construction générale. Il offre une alternative économique aux essences premium plus onéreuses tout en maintenant une qualité fiable pour les marchés export.",
    imageUrl: SAWN_IMAGES[2],
    images: [SAWN_IMAGES[0], LOG_IMAGES[0], LOG_IMAGES[2]],
    specifications: { species: "Bibinga spp.", origin: "Cameroon", durabilityClass: "Class II–III", density: "600–750 kg/m³", use: "Furniture, Interior paneling, Doors, Flooring, General construction" },
    featured: false,
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

  const setCookieHeader = loginRes.headers.get("set-cookie") || "";
  const cookieMatch = setCookieHeader.match(/admin_jwt=([^;]+)/);
  if (!cookieMatch) { console.error("❌ No admin_jwt cookie"); process.exit(1); }
  const adminJwt = cookieMatch[1];
  console.log("✅ Logged in\n");

  let created = 0;
  let skipped = 0;

  for (const species of TIMBER_SPECIES) {
    const { specifications, ...rest } = species;
    const payload = { ...rest, categoryId: CAT_TIMBER, specifications: JSON.stringify(specifications) };

    process.stdout.write(`🌳 Adding: ${species.nameEn}... `);
    const res = await fetch(`${API}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: `admin_jwt=${adminJwt}` },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      console.log(`✅ Created (id: ${data.id})`);
      created++;
    } else {
      const err = await res.json().catch(() => res.text());
      if (res.status === 409) { console.log(`⏭  Already exists`); skipped++; }
      else console.log(`❌ Failed: ${JSON.stringify(err)}`);
    }
  }

  console.log(`\n✅ Done — ${created} created, ${skipped} skipped`);
}

main().catch(console.error);
