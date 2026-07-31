import { Injectable } from '@nestjs/common';

interface Category {
  id: number;
  nameEn: string;
  nameFr: string;
}

export interface GeneratedProduct {
  descriptionEn: string;
  descriptionFr: string;
  specifications: string;
  categoryId: number;
}

// Keyword patterns → category slug
const CATEGORY_PATTERNS: Array<{ keywords: RegExp; slug: string }> = [
  {
    keywords: /lubri|grease|graisse|huile|oil|15w|10w|5w|sae|viscosit|castrol|mobil|total\s|shell\s|azola|rando|tellus|corena|morlina|omala|dexron|atf|gear.?oil|motor.?oil|engine.?oil/i,
    slug: 'lubricants',
  },
  {
    keywords: /filter|filtre|filtration|air.?filter|oil.?filter|fuel.?filter|hydraulic.?filter|cartridge|cartouche|separator|separateur/i,
    slug: 'filters',
  },
  {
    keywords: /generator|generateur|genset|alternator|kva|diesel.?gen|standby|power.?gen|groupe.?electro/i,
    slug: 'generators',
  },
  {
    keywords: /marine|vecom|unitor|tank.?clean|degreaser|degraissant|marpol|carbon.?remov|air.?cooler|multi.?clean|descal|antifoul|bilge|chemical|chimique|chemical.?marine|mainten/i,
    slug: 'marine',
  },
  {
    keywords: /timber|log\b|logs\b|bois|grume|wood|lumber|sapele|ayous|iroko|okoume|teak/i,
    slug: 'timber',
  },
  {
    keywords: /equipment|excavat|bulldozer|forklift|crane|grue|loader|compactor|grader|backhoe|machinery|engin|heavy/i,
    slug: 'equipment',
  },
];

// Templates per category slug
interface Template {
  descEn: (name: string) => string;
  descFr: (name: string) => string;
  specs: (name: string) => string;
}

const TEMPLATES: Record<string, Template> = {
  lubricants: {
    descEn: (n) => `${n} is a high-performance industrial lubricant formulated to protect engines and equipment under demanding operating conditions. Suitable for automotive, marine, and heavy industrial applications.`,
    descFr: (n) => `${n} est un lubrifiant industriel haute performance formulé pour protéger les moteurs et équipements dans des conditions d'utilisation exigeantes. Adapté aux applications automobiles, marines et industrielles lourdes.`,
    specs: () => `Standard: API / ACEA certified\nAvailable volumes: 1L, 5L, 20L, 208L\nOperating temperature: -20°C to +150°C\nShelf life: 5 years (unopened)`,
  },
  filters: {
    descEn: (n) => `${n} is an OEM-grade filtration component designed to maintain optimal fluid cleanliness and extend equipment service life. Compatible with major engine and hydraulic system brands.`,
    descFr: (n) => `${n} est un composant de filtration de qualité OEM conçu pour maintenir la propreté optimale des fluides et prolonger la durée de vie des équipements. Compatible avec les grandes marques de moteurs et systèmes hydrauliques.`,
    specs: () => `Grade: OEM-equivalent\nFiltration efficiency: ≥98%\nPressure rating: Up to 10 bar\nCompatibility: Multi-brand\nPackaging: Individual box`,
  },
  generators: {
    descEn: (n) => `${n} is a reliable industrial power generator designed for continuous and standby power applications. Built for harsh environments with low fuel consumption and easy maintenance access.`,
    descFr: (n) => `${n} est un générateur industriel fiable conçu pour les applications d'alimentation continue et de secours. Conçu pour les environnements difficiles avec une faible consommation de carburant et un accès facile à l'entretien.`,
    specs: () => `Fuel type: Diesel / Gas\nOutput: Available in multiple kVA ratings\nVoltage: 230V / 400V (50Hz)\nCooling: Air-cooled / Water-cooled\nNoise level: <75 dB @ 7m\nAuto-start: Yes`,
  },
  marine: {
    descEn: (n) => `${n} is a MARPOL-compliant marine chemical formulated for professional vessel maintenance. Effective for cleaning, degreasing, and protecting marine systems while meeting international environmental standards.`,
    descFr: (n) => `${n} est un produit chimique marin conforme MARPOL formulé pour l'entretien professionnel des navires. Efficace pour le nettoyage, le dégraissage et la protection des systèmes marins tout en respectant les normes environnementales internationales.`,
    specs: () => `Compliance: MARPOL Annex V / IMO standards\nForm: Liquid concentrate\nDilution ratio: As per application\nMaterial compatibility: Steel, aluminium, rubber seals\nPackaging: 5L, 20L, 25L`,
  },
  timber: {
    descEn: (n) => `${n} is a certified tropical timber product sourced from sustainably managed forests. Available in standard and custom dimensions for construction, furniture, and export trade.`,
    descFr: (n) => `${n} est un produit en bois tropical certifié provenant de forêts gérées durablement. Disponible en dimensions standard et sur mesure pour la construction, le mobilier et le commerce d'exportation.`,
    specs: () => `Origin: Central/West Africa\nCertification: FLEGT / FSC available\nMoisture content: ≤18%\nAvailable: Logs, sawn timber, planks\nCustom dimensions on request`,
  },
  equipment: {
    descEn: (n) => `${n} is heavy-duty industrial equipment built for demanding construction, mining, and logistics operations. Engineered for durability, operator comfort, and low total cost of ownership.`,
    descFr: (n) => `${n} est un équipement industriel robuste conçu pour les opérations exigeantes de construction, d'exploitation minière et de logistique. Conçu pour la durabilité, le confort de l'opérateur et un faible coût total de possession.`,
    specs: () => `Engine: Diesel, Tier 3/4 compliant\nOperating weight: Varies by model\nHydraulic system: Load-sensing\nService interval: 500 hours\nWarranty: 12 months / 2000 hours`,
  },
  general: {
    descEn: (n) => `${n} is a quality commercial product sourced and distributed by LTIC SARL for B2B clients across Africa and international markets. Available in bulk and standard packaging.`,
    descFr: (n) => `${n} est un produit commercial de qualité fourni et distribué par LTIC SARL aux clients professionnels en Afrique et sur les marchés internationaux. Disponible en vrac et en emballage standard.`,
    specs: () => `Packaging: Standard and custom available\nMinimum order: Contact us\nDelivery: Worldwide\nOrigin: International sourcing`,
  },
};

@Injectable()
export class AiService {
  async generateProduct(productName: string, categories: Category[]): Promise<GeneratedProduct> {
    const slug = this.detectSlug(productName);
    const template = TEMPLATES[slug] ?? TEMPLATES.general;
    const categoryId = this.matchCategory(slug, categories);

    return {
      descriptionEn: template.descEn(productName),
      descriptionFr: template.descFr(productName),
      specifications: template.specs(productName),
      categoryId,
    };
  }

  private detectSlug(name: string): string {
    for (const { keywords, slug } of CATEGORY_PATTERNS) {
      if (keywords.test(name)) return slug;
    }
    return 'general';
  }

  private matchCategory(slug: string, categories: Category[]): number {
    const slugMap: Record<string, string[]> = {
      lubricants: ['lubricant', 'oil', 'lubrifiant', 'huile'],
      filters:    ['filter', 'filtre', 'part'],
      generators: ['generator', 'generateur', 'power'],
      marine:     ['marine', 'chemical', 'chimique', 'maintenance'],
      timber:     ['timber', 'log', 'bois', 'grume', 'wood'],
      equipment:  ['equipment', 'heavy', 'engin', 'lourd'],
      general:    ['general', 'merchandise', 'marchandise', 'commerce'],
    };

    const keywords = slugMap[slug] ?? slugMap.general;

    for (const kw of keywords) {
      const match = categories.find(
        (c) =>
          c.nameEn.toLowerCase().includes(kw) ||
          c.nameFr.toLowerCase().includes(kw),
      );
      if (match) return match.id;
    }

    return categories[0]?.id ?? 1;
  }
}
