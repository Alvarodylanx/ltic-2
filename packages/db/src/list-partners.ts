import { Pool } from "pg";
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query("SELECT id, name, logo_url, website FROM partners ORDER BY id").then((r: any) => {
  r.rows.forEach((row: any) =>
    console.log(`${row.id} | ${row.name} | logo:${row.logo_url || "null"} | site:${row.website || "null"}`)
  );
  pool.end();
}).catch((e: any) => { console.error(e.message); pool.end(); });
