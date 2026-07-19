const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
console.log("envContent length:", envContent.length);

envContent.split('\n').forEach((line, i) => {
  const match = line.match(/^\s*([^#=\s]+)\s*=\s*(.*)$/);
  console.log(`Line ${i}:`, JSON.stringify(line), "Match:", !!match);
  if (match) {
    let value = match[2].trim();
    console.log(`  Key: ${match[1]}, Value length: ${value.length}`);
    process.env[match[1]] = value;
  }
});

console.log("NEXT_PUBLIC_SUPABASE_URL:", JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_URL));
console.log("SUPABASE_SERVICE_ROLE_KEY:", JSON.stringify(process.env.SUPABASE_SERVICE_ROLE_KEY));
