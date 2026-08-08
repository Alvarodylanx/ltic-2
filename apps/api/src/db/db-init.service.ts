import { Injectable, OnModuleInit, Logger, Inject } from '@nestjs/common';
import { DB_TOKEN } from './db.constants';
import type { Db } from './db.module';
import { sql } from 'drizzle-orm';

@Injectable()
export class DbInitService implements OnModuleInit {
  private readonly logger = new Logger(DbInitService.name);

  constructor(@Inject(DB_TOKEN) private db: Db) {}

  async onModuleInit() {
    await this.db.execute(sql`
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_id INTEGER;
    `);
    await this.db.execute(sql`
      ALTER TABLE customers ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
      ALTER TABLE customers ADD COLUMN IF NOT EXISTS email_verification_token TEXT;
      ALTER TABLE customers ADD COLUMN IF NOT EXISTS email_verification_expires TIMESTAMP;
    `);
    await this.db.execute(sql`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id         SERIAL PRIMARY KEY,
        email      TEXT NOT NULL,
        token      TEXT NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        used       BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    await this.db.execute(sql`
      CREATE TABLE IF NOT EXISTS partners (
        id            SERIAL PRIMARY KEY,
        name          TEXT NOT NULL UNIQUE,
        logo_url      TEXT,
        sector_en     TEXT NOT NULL DEFAULT '',
        sector_fr     TEXT NOT NULL DEFAULT '',
        products_en   TEXT DEFAULT '',
        products_fr   TEXT DEFAULT '',
        website       TEXT,
        display_order INTEGER DEFAULT 0,
        active        BOOLEAN DEFAULT TRUE,
        created_at    TIMESTAMP DEFAULT NOW()
      );
    `);
    /* Add unique constraint on name if the table existed before without it */
    await this.db.execute(sql`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'partners_name_key'
        ) THEN
          ALTER TABLE partners ADD CONSTRAINT partners_name_key UNIQUE (name);
        END IF;
      END $$;
    `);
    await this.db.execute(sql`
      INSERT INTO partners (name, logo_url, sector_en, sector_fr, products_en, products_fr, website, display_order) VALUES
        ('TotalEnergies', 'https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Logo_TotalEnergies_(2021).png&width=200',  'Energy & Lubricants',     'Énergie & Lubrifiants',          'Lubricants, motor oils, industrial fluids, greases',                        'Lubrifiants, huiles moteur, fluides industriels, graisses',                      'https://totalenergies.com',    1),
        ('Shell',         'https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Shell_wordmark_2019.svg&width=200',         'Energy & Lubricants',     'Énergie & Lubrifiants',          'Engine oils, lubricants, industrial fluids, hydraulic oils',                 'Huiles moteur, lubrifiants, fluides industriels, huiles hydrauliques',           'https://shell.com',            2),
        ('Caterpillar',   'https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Caterpillar_logo.svg&width=200',            'Heavy Equipment',         'Équipement Lourd',               'Excavators, bulldozers, generators, spare parts, filters',                  'Excavatrices, bulldozers, générateurs, pièces détachées, filtres',              'https://cat.com',              3),
        ('Volvo',         'https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Volvo_logo.svg&width=200',                  'Transport & Equipment',   'Transport & Équipement',         'Trucks, construction equipment, engines, spare parts',                      'Camions, équipements de construction, moteurs, pièces détachées',               'https://volvogroup.com',       4),
        ('Komatsu',       'https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Komatsu_company_logos.svg&width=200',       'Industrial Equipment',    'Équipement Industriel',          'Mining equipment, bulldozers, forklifts, spare parts',                     'Équipements miniers, bulldozers, chariots élévateurs, pièces détachées',        'https://komatsu.com',          5),
        ('Cummins',       'https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Cummins_logo.svg&width=200',                'Engines & Generators',    'Moteurs & Groupes Électrogènes', 'Diesel generators, engines, alternators, filters, spare parts',              'Groupes électrogènes diesel, moteurs, alternateurs, filtres, pièces',           'https://cummins.com',          6),
        ('Maersk',        'https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Maersk_Line_Logo,_July_2021.svg&width=200', 'Ocean Freight',           'Fret Maritime',                  'Container shipping, sea freight, logistics, port services',                 'Transport conteneurs, fret maritime, logistique, services portuaires',           'https://maersk.com',           7),
        ('CMA CGM',       'https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/CMA_CGM_logo.svg&width=200',               'Shipping & Logistics',    'Transport Maritime',             'Sea freight, container transport, port operations, supply chain',            'Fret maritime, transport conteneurs, opérations portuaires, chaîne logistique', 'https://cmacgm.com',           8),
        ('DHL',           'https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/DHL_Express_logo.svg&width=200',            'Express Logistics',       'Logistique Express',             'International express freight, customs clearance, warehousing',             'Fret express international, dédouanement, entreposage',                         'https://dhl.com',              9),
        ('Bolloré',       'https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Bolloré_logo.svg&width=200',               'Africa Logistics',        'Logistique Afrique',             'Port logistics, rail transport, warehousing, customs brokerage in Africa',  'Logistique portuaire, transport ferroviaire, entreposage, transitaire Afrique',  'https://bollore-logistics.com',10),
        ('Liebherr',      'https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Liebherr-Logo.svg&width=200',               'Cranes & Equipment',      'Grues & Équipement',             'Mobile cranes, tower cranes, construction machinery, refrigeration units',  'Grues mobiles, grues à tour, engins de construction, groupes frigorifiques',    'https://liebherr.com',        11),
        ('Eiffage',       'https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Logo_Eiffage.svg&width=200',                'Construction',            'Construction',                   'Civil works, building construction, infrastructure, industrial projects',    'Travaux civils, construction, infrastructures, projets industriels',             'https://eiffage.com',         12)
      ON CONFLICT (name) DO UPDATE SET
        logo_url = EXCLUDED.logo_url,
        sector_en = EXCLUDED.sector_en,
        sector_fr = EXCLUDED.sector_fr,
        products_en = EXCLUDED.products_en,
        products_fr = EXCLUDED.products_fr,
        website = EXCLUDED.website,
        display_order = EXCLUDED.display_order;
    `);
    await this.db.execute(sql`
      CREATE TABLE IF NOT EXISTS page_views (
        id         SERIAL PRIMARY KEY,
        page       TEXT NOT NULL,
        session_id TEXT NOT NULL,
        date       TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS page_views_date_idx ON page_views (date);
    `);
    this.logger.log('Database tables verified');
  }
}
