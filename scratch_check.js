global.WebSocket = class {}; // Mock WebSocket

const fs = require("fs");
const path = require("path");

const content = fs.readFileSync(".env.local", "utf8");
const env = {};
content.split("\n").forEach(line => {
  const parts = line.split("=");
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const val = parts.slice(1).join("=").trim().replace(/^["']|["']$/g, "");
    env[key] = val;
  }
});

const encoder = new TextEncoder();

function base64UrlEncode(str) {
  const bytes = encoder.encode(str);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function getHmacKey(secret) {
  const secretBytes = encoder.encode(secret);
  return await crypto.subtle.importKey(
    "raw",
    secretBytes,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

async function signSession(payload, secret) {
  const jsonString = JSON.stringify(payload);
  const base64Payload = base64UrlEncode(jsonString);
  
  const key = await getHmacKey(secret);
  const dataBytes = encoder.encode(jsonString);
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, dataBytes);
  const signatureBytes = new Uint8Array(signatureBuffer);
  
  let binarySignature = "";
  for (let i = 0; i < signatureBytes.byteLength; i++) {
    binarySignature += String.fromCharCode(signatureBytes[i]);
  }
  const base64Signature = btoa(binarySignature)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  
  return `${base64Payload}.${base64Signature}`;
}

async function run() {
  const payload = {
    id: "74eb4b6d-fe56-46dd-abba-e0df5df56189",
    cntsId: "CNTS26-YYZKC",
    email: "jan810693@gmail.com",
    phone: "918707884735",
    role: "SUPER_ADMIN",
    is_2fa_verified: true,
    mfa_verified: true,
    last_2fa_time: Date.now(), // needs to match name 'last_2fa_time' in verifySession
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000
  };
  
  const token = await signSession(payload, env.SUPABASE_SERVICE_ROLE_KEY);
  console.log("Generated Custom Admin Token:", token);

  try {
    console.log("Sending GET request to http://localhost:3000/api/registrations...");
    const res = await fetch("http://localhost:3000/api/registrations", {
      headers: {
        cookie: `cnts_session=${token}`
      }
    });
    const body = await res.json();
    console.log("HTTP Response Status:", res.status);
    console.log("HTTP Response Body:", JSON.stringify(body, null, 2));
  } catch (err) {
    console.error("HTTP Fetch failed:", err);
  }
}

run();
