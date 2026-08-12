import fs from "fs";
import path from "path";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

let connectionString =
  process.env.STORAGE_POSTGRES_URL_NON_POOLING ||
  process.env.STORAGE_POSTGRES_URL ||
  process.env.STORAGE_POSTGRES_PRISMA_URL;

if (!connectionString) {
  console.error("❌ Error: No PostgreSQL connection string found in .env file.");
  process.exit(1);
}

const cleanUrl = connectionString.replace(/\?sslmode=[^&]*/, "").replace(/&sslmode=[^&]*/, "");

const sqlFilePath = process.argv[2] || path.join(process.cwd(), "supabase_migration_complete.sql");

if (!fs.existsSync(sqlFilePath)) {
  console.error(`❌ Error: SQL file not found at ${sqlFilePath}`);
  process.exit(1);
}

console.log(`🔌 Connecting to Supabase database...`);
console.log(`📄 Executing SQL script: ${path.basename(sqlFilePath)}`);

const client = new pg.Client({
  connectionString: cleanUrl,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function runMigration() {
  try {
    await client.connect();
    console.log("✅ Connected to Supabase PostgreSQL.");

    // Step 1: Pre-commit any enum type additions if existing user_role enum exists
    try {
      await client.query("ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'super_admin';");
      console.log("  ↳ Pre-committed 'super_admin' to user_role enum if present.");
    } catch (enumErr) {
      // Ignore if user_role enum doesn't exist yet
    }

    // Step 2: Execute full migration SQL
    const sqlContent = fs.readFileSync(sqlFilePath, "utf8");
    await client.query(sqlContent);

    console.log("🎉 Successfully executed migration SQL on Supabase database!");
  } catch (error) {
    console.error("❌ Error executing migration SQL:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
