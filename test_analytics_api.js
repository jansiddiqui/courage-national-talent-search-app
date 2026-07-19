global.WebSocket = class {}; // Mock WebSocket

const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

const content = fs.readFileSync(path.resolve(__dirname, ".env.local"), "utf8");
const env = {};
content.split("\n").forEach(line => {
  const parts = line.split("=");
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const val = parts.slice(1).join("=").trim().replace(/^["']|["']$/g, "");
    env[key] = val;
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function test() {
  try {
    let regKpiQuery = supabase.from("registrations").select("id, cnts_id, registration_id, payment_status, created_at");
    const { data: regKpis, error } = await regKpiQuery;
    
    if (error) {
      console.error("Error:", error);
      return;
    }
    
    console.log("Raw regKpis length:", regKpis ? regKpis.length : 0);
    console.log("Raw regKpis:", regKpis);
    
    const totalRegistrations = regKpis?.filter((r) => r.payment_status === "SUCCESS" || r.payment_status === "PAID").length || 0;
    console.log("Computed totalRegistrations:", totalRegistrations);
  } catch (e) {
    console.error(e);
  }
}

test();
