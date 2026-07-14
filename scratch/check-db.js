const fs = require("fs");
const path = require("path");

// Load .env.local manually
const envPath = path.join(__dirname, "..", ".env.local");
if (!fs.existsSync(envPath)) {
  console.error(".env.local not found!");
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, "utf-8");
const env = {};
envContent.split("\n").forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
  if (match) {
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.slice(1, -1);
    }
    env[match[1]] = val;
  }
});

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing supabase URL or service role key in .env.local");
  process.exit(1);
}

async function queryTable(tableName) {
  const endpoint = `${url}/rest/v1/${tableName}?select=*`;
  try {
    const res = await fetch(endpoint, {
      headers: {
        "apikey": serviceKey,
        "Authorization": `Bearer ${serviceKey}`,
        "Content-Type": "application/json"
      }
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error(`Error querying ${tableName}:`, res.status, errText);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error(`Fetch error for ${tableName}:`, err);
    return null;
  }
}

async function run() {
  console.log("=== admin_users ===");
  const users = await queryTable("admin_users");
  console.log(JSON.stringify(users, null, 2));

  console.log("\n=== admin_roles ===");
  const roles = await queryTable("admin_roles");
  console.log(JSON.stringify(roles, null, 2));

  console.log("\n=== admin_permissions ===");
  const perms = await queryTable("admin_permissions");
  console.log(JSON.stringify(perms, null, 2));

  console.log("\n=== admin_user_roles ===");
  const userRoles = await queryTable("admin_user_roles");
  console.log(JSON.stringify(userRoles, null, 2));

  console.log("\n=== admin_role_permissions ===");
  const rolePerms = await queryTable("admin_role_permissions");
  console.log(JSON.stringify(rolePerms, null, 2));
}

run();
