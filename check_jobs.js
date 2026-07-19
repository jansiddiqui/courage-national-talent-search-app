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

async function check() {
  const jobsUrl = `${supabaseUrl}/rest/v1/admin_background_jobs?id=eq.57cc64d2-4be2-43ea-a2ee-50f1fc253e0e`;
  const jobsRes = await fetch(jobsUrl, {
    headers: {
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`,
    }
  });
  const jobs = await jobsRes.json();
  console.log("Stuck background job details:");
  console.log(JSON.stringify(jobs[0], null, 2));
}

check();
