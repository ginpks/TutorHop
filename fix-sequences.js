import { getDatabaseService } from "./src/server/Services/UtilitiesServices/DatabaseService.js";
import { sql } from "drizzle-orm";

/**
 * Fix PostgreSQL sequence values for auto-incrementing primary keys
 * Run this script when you get "duplicate key value violates unique constraint" errors
 *
 * Usage: node fix-sequences.js
 */

async function fixSequences() {
  console.log("Starting sequence fix...\n");

  try {
    const db = await getDatabaseService();
    const database = db.db;

    // Fix meeting_requests sequence
    console.log("Fixing meeting_requests sequence...");
    await database.execute(sql`
      SELECT setval(
        pg_get_serial_sequence('meeting_requests', 'id'),
        COALESCE((SELECT MAX(id) FROM meeting_requests), 0) + 1,
        false
      );
    `);
    console.log("✓ meeting_requests sequence fixed");

    // Fix users sequence
    console.log("Fixing users sequence...");
    await database.execute(sql`
      SELECT setval(
        'users_id_seq',
        COALESCE((SELECT MAX(id) FROM users), 0) + 1,
        false
      );
    `);
    console.log("✓ users sequence fixed");

    // Fix subjects sequence
    console.log("Fixing subjects sequence...");
    await database.execute(sql`
      SELECT setval(
        pg_get_serial_sequence('subjects', 'id'),
        COALESCE((SELECT MAX(id) FROM subjects), 0) + 1,
        false
      );
    `);
    console.log("✓ subjects sequence fixed");

    // Fix availability_slots sequence
    console.log("Fixing availability_slots sequence...");
    await database.execute(sql`
      SELECT setval(
        pg_get_serial_sequence('availability_slots', 'id'),
        COALESCE((SELECT MAX(id) FROM availability_slots), 0) + 1,
        false
      );
    `);
    console.log("✓ availability_slots sequence fixed");

    console.log("\n✅ All sequences have been fixed successfully!");
    console.log("You can now create new records without conflicts.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error fixing sequences:", error);
    process.exit(1);
  }
}

fixSequences();
