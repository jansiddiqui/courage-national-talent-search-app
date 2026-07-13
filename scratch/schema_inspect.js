const fs = require('fs');
const path = require('path');

// Read .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const getEnvVar = (name) => {
  const match = envContent.match(new RegExp(`^${name}=(.*)$`, 'm'));
  return match ? match[1].trim() : null;
};

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const supabaseServiceKey = getEnvVar('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase configuration");
  process.exit(1);
}

async function run() {
  console.log("Fetching DB Schema from PostgREST OpenAPI endpoint...");
  const response = await fetch(`${supabaseUrl}/rest/v1/`, {
    headers: {
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`
    }
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("Error fetching schema:", response.status, errText);
    process.exit(1);
  }

  const schema = await response.json();
  const tables = ['schools', 'school_coordinators', 'school_fee_ledger', 'school_documents', 'school_upload_batches', 'registrations'];
  
  for (const t of tables) {
    const tableInfo = schema.definitions[t];
    if (tableInfo) {
      console.log(`\nTable: ${t}`);
      console.log("Properties:");
      for (const [propName, propVal] of Object.entries(tableInfo.properties)) {
        console.log(`  - ${propName}: ${propVal.type} (${propVal.format || 'no format'})`);
      }
    } else {
      console.log(`\nTable: ${t} - NOT FOUND IN DEFINITIONS`);
    }
  }
}

run().catch(console.error);
