import { pgTable, serial, text, boolean, timestamp } from 'drizzle-orm/pg-core';

export const spotlight = pgTable('homepage_spotlight', {
  id:            serial('id').primaryKey(),
  label:         text('label').default('ECOKLIN — Made in Douala'),
  headlineEn:    text('headline_en').notNull().default('ECOKLIN —\nCleaner by Nature.'),
  headlineFr:    text('headline_fr').notNull().default('ECOKLIN —\nPropre par Nature.'),
  bodyEn:        text('body_en').default('LTIC SARL manufactures ECOKLIN — a complete range of eco-friendly cleaning, hygiene and industrial sanitation products, produced at our factory in PK13, Douala.'),
  bodyFr:        text('body_fr').default("LTIC SARL fabrique ECOKLIN — une gamme complète de produits de nettoyage, d'hygiène et de désinfection industrielle écologiques, produits dans notre usine à PK13, Douala."),
  subBodyEn:     text('sub_body_en').default('Bleach, degreasers, descalers, liquid soaps and more — available for bulk and unit supply across Central Africa.'),
  subBodyFr:     text('sub_body_fr').default("Eau de Javel, dégraissants, détartrants, savons liquides et plus — disponibles en vrac et à l'unité en Afrique Centrale."),
  bgImageUrl:    text('bg_image_url').default('/images/industrial-supply-service.jpg'),
  mediaUrl:      text('media_url').default('/videos/ecoklin-factory.mp4'),
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
