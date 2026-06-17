/* eslint-disable @typescript-eslint/no-explicit-any */
const encoder = new TextEncoder();
const decoder = new TextDecoder();

function base64UrlEncode(str: string): string {
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

function base64UrlDecode(str: string): string {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (str.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return decoder.decode(bytes);
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  const secretBytes = encoder.encode(secret);
  return await crypto.subtle.importKey(
    "raw",
    secretBytes,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function signSession(payload: any, secret: string): Promise<string> {
  if (!secret) {
    throw new Error("CRITICAL SECURITY ERROR: Secret key is required to sign sessions.");
  }
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

export async function verifySession(token: string, secret: string): Promise<any | null> {
  if (!token || !secret) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [base64Payload, base64Signature] = parts;
  
  try {
    const jsonString = base64UrlDecode(base64Payload);
    const payload = JSON.parse(jsonString);
    
    // Validate expiration
    if (payload.exp && Date.now() > payload.exp) {
      return null;
    }

    const key = await getHmacKey(secret);
    
    // Decode signature
    const paddedSig = base64Signature.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (base64Signature.length % 4)) % 4);
    const binarySig = atob(paddedSig);
    const signatureBytes = new Uint8Array(binarySig.length);
    for (let i = 0; i < binarySig.length; i++) {
      signatureBytes[i] = binarySig.charCodeAt(i);
    }
    
    const dataBytes = encoder.encode(jsonString);
    const isValid = await crypto.subtle.verify("HMAC", key, signatureBytes, dataBytes);
    if (!isValid) return null;
    
    return payload;
  } catch {
    return null;
  }
}

async function sha256(message: string): Promise<string> {
  const msgBuffer = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function generateFingerprint(ip: string, userAgent: string): Promise<{ ipHash: string, userAgentHash: string }> {
  const ipHash = await sha256(ip || 'unknown');
  const userAgentHash = await sha256(userAgent || 'unknown');
  return { ipHash, userAgentHash };
}

export function is2FaFresh(session: any): boolean {
  if (!session || !session.is_2fa_verified) return false;
  const TEN_MINUTES = 10 * 60 * 1000;
  if (!session.last_2fa_time) return false;
  return (Date.now() - session.last_2fa_time) <= TEN_MINUTES;
}
