const fs = require('fs');

// Parse .env.local
const envPath = '.env.local';
let supabaseUrl = '';
let supabaseServiceKey = '';
try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const matchUrl = envContent.match(/^NEXT_PUBLIC_SUPABASE_URL\s*=\s*(.*)$/m);
  if (matchUrl) supabaseUrl = matchUrl[1].trim().replace(/['"]/g, '');
  const matchKey = envContent.match(/^SUPABASE_SERVICE_ROLE_KEY\s*=\s*(.*)$/m);
  if (matchKey) supabaseServiceKey = matchKey[1].trim().replace(/['"]/g, '');
} catch (e) {
  console.error("Failed to read .env.local:", e.message);
}

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Supabase config not found in env!");
  process.exit(1);
}

async function run() {
  const workerId = "82c84d70-4d0d-459f-8f73-a59d5936e8f4";
  console.log("Calling claim_next_admin_job RPC via REST...");

  const url = `${supabaseUrl}/rest/v1/rpc/claim_next_admin_job`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      p_worker_id: workerId,
      p_lease_seconds: 300
    })
  });

  console.log("Response status:", res.status);
  const text = await res.text();
  console.log("Response text:", text);
}

run();
