const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runMigration() {
  try {
    // Read SQL files
    const schemaSQL = fs.readFileSync(path.join(__dirname, '../sql/schema.sql'), 'utf8');
    const policiesSQL = fs.readFileSync(path.join(__dirname, '../sql/policies.sql'), 'utf8');
    const seedSQL = fs.readFileSync(path.join(__dirname, '../sql/seed.sql'), 'utf8');

    // Execute schema
    console.log('Applying schema...');
    const { error: schemaError } = await supabase.rpc('exec_sql', {
      sql_query: schemaSQL,
    });
    if (schemaError) throw schemaError;

    // Execute policies
    console.log('Applying RLS policies...');
    const { error: policiesError } = await supabase.rpc('exec_sql', {
      sql_query: policiesSQL,
    });
    if (policiesError) throw policiesError;

    // Execute seed data
    console.log('Seeding data...');
    const { error: seedError } = await supabase.rpc('exec_sql', {
      sql_query: seedSQL,
    });
    if (seedError) throw seedError;

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
