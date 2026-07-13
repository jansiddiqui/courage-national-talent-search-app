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
  console.log("Running preflight check on school_fee_ledger reference_id duplicates...");
  
  const url = `${supabaseUrl}/rest/v1/school_fee_ledger?select=reference_id&reference_id=not.is.null`;
  const response = await fetch(url, {
    headers: {
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("Error fetching school_fee_ledger from REST API:", response.status, errText);
    process.exit(1);
  }

  const data = await response.json();
  console.log(`Fetched ${data.length} records with non-null reference_id.`);

  const counts = {};
  const duplicates = [];
  
  for (const row of data) {
    const ref = row.reference_id;
    counts[ref] = (counts[ref] || 0) + 1;
  }

  for (const [ref, count] of Object.entries(counts)) {
    if (count > 1) {
      duplicates.push({ reference_id: ref, count });
    }
  }

  if (duplicates.length > 0) {
    console.error("BLOCKER FOUND: Duplicate non-null reference_id values exist in school_fee_ledger:", duplicates);
    process.exit(2);
  } else {
    console.log("SUCCESS: No duplicate non-null reference_id values found in school_fee_ledger.");
  }
}

run().catch(console.error);
