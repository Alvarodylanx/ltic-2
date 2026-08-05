import { pgTable, serial, text, boolean, timestamp } from 'drizzle-orm/pg-core';

export const spotlight = pgTable('homepage_spotlight', {
  id:            serial('id').primaryKey(),
  label:         text('label').default('Consumer & Industrial Goods'),
  headlineEn:    text('headline_en').notNull().default('Premium Oils &\nContainer Supply.'),
  headlineFr:    text('headline_fr').notNull().default('Huiles Premium &\nFourniture de Contenants.'),
  bodyEn:        text('body_en').default('From premium sunflower and edible oils to a full range of industrial containers — sourced directly from certified producers, available for bulk or unit supply.'),
  bodyFr:        text('body_fr').default("Des huiles de tournesol et alimentaires premium à une gamme complète de contenants industriels — approvisionnés directement auprès de producteurs certifiés."),
  subBodyEn:     text('sub_body_en').default('Available for export, import & commercial distribution across Africa and Europe.'),
  subBodyFr:     text('sub_body_fr').default("Disponible pour l'export, l'import et la distribution commerciale en Afrique et en Europe."),
  bgImageUrl:    text('bg_image_url').default('/images/lubricants-oils.jpg'),
  mediaUrl:      text('media_url').default('/videos/oils-collection.mp4'),
  mediaType:     text('media_type').default('video'),   // 'video' | 'image'
  cta1LabelEn:   text('cta1_label_en').default('Request Supply Quote'),
  cta1LabelFr:   text('cta1_label_fr').default('Demander un Devis'),
  cta1Href:      text('cta1_href').default('/quote'),
  cta2LabelEn:   text('cta2_label_en').default('Contact Us'),
  cta2LabelFr:   text('cta2_label_fr').default('Nous Contacter'),
  cta2Href:      text('cta2_href').default('/contact'),
  isActive:      boolean('is_active').default(true),
  updatedAt:     timestamp('updated_at').notNull().defaultNow(),
});

export type Spotlight    = typeof spotlight.$inferSelect;
export type NewSpotlight = typeof spotlight.$inferInsert;
