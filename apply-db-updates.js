const postgres = require('postgres');
const fs = require('fs');
const path = require('path');

// Zero-dependency env loader for local CLI commands
const envLocalPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  const envConfig = fs.readFileSync(envLocalPath, "utf-8");
  for (const line of envConfig.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const firstEq = trimmed.indexOf("=");
      if (firstEq > 0) {
        const key = trimmed.substring(0, firstEq).trim();
        let val = trimmed.substring(firstEq + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.substring(1, val.length - 1);
        }
        process.env[key] = val;
      }
    }
  }
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not defined in .env.local");
  process.exit(1);
}

const client = postgres(connectionString, { prepare: false });

async function run() {
  console.log("Renaming events.type to events.event_type...");
  try {
    const columns = await client`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'events' AND column_name = 'type'
    `;
    if (columns.length > 0) {
      await client`ALTER TABLE "events" RENAME COLUMN "type" TO "event_type"`;
      console.log("Column 'type' renamed to 'event_type' successfully.");
    } else {
      console.log("Column 'type' does not exist in 'events' table, assuming it is already 'event_type'.");
    }
  } catch (err) {
    console.error("Error renaming column:", err);
  }

  console.log("Applying RLS policies to new tables...");
  try {
    const queries = [
      // 1. invitation_designs
      `ALTER TABLE "invitation_designs" ENABLE ROW LEVEL SECURITY;`,
      `DROP POLICY IF EXISTS "Allow owners to manage their own invitation designs" ON "invitation_designs";`,
      `CREATE POLICY "Allow owners to manage their own invitation designs" ON "invitation_designs" 
       FOR ALL TO authenticated USING (auth.uid()::text = user_id) WITH CHECK (auth.uid()::text = user_id);`,
      `DROP POLICY IF EXISTS "Allow public read access to invitation designs" ON "invitation_designs";`,
      `CREATE POLICY "Allow public read access to invitation designs" ON "invitation_designs" 
       FOR SELECT TO public USING (true);`,

      // 2. relationship_nodes
      `ALTER TABLE "relationship_nodes" ENABLE ROW LEVEL SECURITY;`,
      `DROP POLICY IF EXISTS "Allow event owners to manage relationship nodes" ON "relationship_nodes";`,
      `CREATE POLICY "Allow event owners to manage relationship nodes" ON "relationship_nodes" 
       FOR ALL TO authenticated USING (
         EXISTS (SELECT 1 FROM events WHERE events.id = relationship_nodes.event_id AND events.user_id = auth.uid()::text)
       ) WITH CHECK (
         EXISTS (SELECT 1 FROM events WHERE events.id = relationship_nodes.event_id AND events.user_id = auth.uid()::text)
       );`,
      `DROP POLICY IF EXISTS "Allow public read access to relationship nodes" ON "relationship_nodes";`,
      `CREATE POLICY "Allow public read access to relationship nodes" ON "relationship_nodes" 
       FOR SELECT TO public USING (true);`,

      // 3. relationship_edges
      `ALTER TABLE "relationship_edges" ENABLE ROW LEVEL SECURITY;`,
      `DROP POLICY IF EXISTS "Allow event owners to manage relationship edges" ON "relationship_edges";`,
      `CREATE POLICY "Allow event owners to manage relationship edges" ON "relationship_edges" 
       FOR ALL TO authenticated USING (
         EXISTS (SELECT 1 FROM events WHERE events.id = relationship_edges.event_id AND events.user_id = auth.uid()::text)
       ) WITH CHECK (
         EXISTS (SELECT 1 FROM events WHERE events.id = relationship_edges.event_id AND events.user_id = auth.uid()::text)
       );`,
      `DROP POLICY IF EXISTS "Allow public read access to relationship edges" ON "relationship_edges";`,
      `CREATE POLICY "Allow public read access to relationship edges" ON "relationship_edges" 
       FOR SELECT TO public USING (true);`,

      // 4. invitation_versions
      `ALTER TABLE "invitation_versions" ENABLE ROW LEVEL SECURITY;`,
      `DROP POLICY IF EXISTS "Allow owners to manage invitation versions" ON "invitation_versions";`,
      `CREATE POLICY "Allow owners to manage invitation versions" ON "invitation_versions" 
       FOR ALL TO authenticated USING (
         EXISTS (
           SELECT 1 FROM invitation_designs 
           WHERE invitation_designs.id = invitation_versions.design_id 
           AND invitation_designs.user_id = auth.uid()::text
         )
       ) WITH CHECK (
         EXISTS (
           SELECT 1 FROM invitation_designs 
           WHERE invitation_designs.id = invitation_versions.design_id 
           AND invitation_designs.user_id = auth.uid()::text
         )
       );`,
      `DROP POLICY IF EXISTS "Allow public read access to invitation versions" ON "invitation_versions";`,
      `CREATE POLICY "Allow public read access to invitation versions" ON "invitation_versions" 
       FOR SELECT TO public USING (true);`
    ];

    for (const q of queries) {
      await client.unsafe(q);
    }
    console.log("RLS policies applied successfully.");
  } catch (err) {
    console.warn("Could not apply RLS policies:", err.message);
  }

  process.exit(0);
}

run().catch(console.error);
