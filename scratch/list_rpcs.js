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
  console.log("Fetching OpenAPI spec to list available RPC paths...");
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

  const spec = await response.json();
  const paths = Object.keys(spec.paths || {});
  console.log("Available RPC paths (starting with /rpc/):");
  const rpcs = paths.filter(p => p.startsWith('/rpc/'));
  for (const r of rpcs) {
    console.log(`  - ${r}`);
  }
}

run().catch(console.error);
