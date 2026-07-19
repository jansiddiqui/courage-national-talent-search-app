const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
envContent.split('\n').forEach(line => {
  const cleanLine = line.replace('\r', '').trim();
  if (!cleanLine || cleanLine.startsWith('#')) return;
  const parts = cleanLine.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const value = parts.slice(1).join('=').trim();
    process.env[key] = value;
  }
});

const tavilyKey = process.env.TAVILY_API_KEY;
const googleKey = process.env.GOOGLE_SEARCH_API_KEY;
const googleCx = process.env.GOOGLE_SEARCH_CX;

async function testTavily() {
  console.log("Testing Tavily...");
  if (!tavilyKey) {
    console.log("Tavily key not set.");
    return;
  }
  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: tavilyKey,
        query: "top schools in Delhi",
        max_results: 3
      })
    });
    console.log("Tavily Status:", res.status);
    const data = await res.json();
    console.log("Tavily Response keys:", Object.keys(data));
    console.log("Tavily first result:", data.results?.[0]);
  } catch (err) {
    console.error("Tavily failed:", err);
  }
}

async function testGoogle() {
  console.log("Testing Google CSE...");
  if (!googleKey || !googleCx) {
    console.log("Google CSE not configured.");
    return;
  }
  const url = `https://customsearch.googleapis.com/customsearch/v1?key=${googleKey}&cx=${googleCx}&q=${encodeURIComponent("top schools in Delhi")}&num=3`;
  try {
    const res = await fetch(url);
    console.log("Google Status:", res.status);
    const data = await res.json();
    console.log("Google Response keys:", Object.keys(data));
    console.log("Google first item:", data.items?.[0]);
  } catch (err) {
    console.error("Google failed:", err);
  }
}

async function run() {
  await testTavily();
  console.log("-------------------");
  await testGoogle();
}

run();
