import crypto from "crypto";
import { authenticator } from "otplib";

const ENCRYPTION_KEY = process.env.ADMIN_TOTP_ENCRYPTION_KEY;
const ALGORITHM = "aes-256-gcm";

export function getTotpEncryptionKey(): Buffer {
  if (!ENCRYPTION_KEY) {
    throw new Error("CRITICAL CONFIGURATION ERROR: ADMIN_TOTP_ENCRYPTION_KEY is required for 2FA.");
  }
  const key = Buffer.from(ENCRYPTION_KEY, "base64");
  if (key.length !== 32) {
    throw new Error("ADMIN_TOTP_ENCRYPTION_KEY must be a 32-byte base64 encoded string.");
  }
  return key;
}

/**
 * Encrypts a TOTP secret using AES-256-GCM
 * @param text The plain text secret
 * @returns format: base64(iv):base64(authTag):base64(encrypted)
 */
export function encryptSecret(text: string): string {
  const key = getTotpEncryptionKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");
  const authTag = cipher.getAuthTag().toString("base64");

  return `${iv.toString("base64")}:${authTag}:${encrypted}`;
}

/**
 * Decrypts a TOTP secret encrypted with encryptSecret
 */
export function decryptSecret(encryptedData: string): string {
  const key = getTotpEncryptionKey();
  const parts = encryptedData.split(":");
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted data format");
  }

  const iv = Buffer.from(parts[0], "base64");
  const authTag = Buffer.from(parts[1], "base64");
  const encryptedText = parts[2];

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedText, "base64", "utf8");
  decrypted += decipher.final("utf8");
  
  return decrypted;
}

/**
 * Hashes a recovery code using SHA-256
 */
export function hashRecoveryCode(code: string): string {
  return crypto.createHash("sha256").update(code).digest("hex");
}

/**
 * Verifies a TOTP code against the stored encrypted secret
 */
export function verifyTotp(code: string, encryptedSecret: string): boolean {
  try {
    const secret = decryptSecret(encryptedSecret);
    return authenticator.verify({ token: code, secret });
  } catch (err) {
    console.error("TOTP verification error:", err);
    return false;
  }
}

/**
 * Generates a new TOTP secret and returns both plain (for initial setup) and encrypted
 */
export function generateTotpSecret(userEmail: string) {
  const secret = authenticator.generateSecret();
  const otpauth = authenticator.keyuri(userEmail, "CNTS Admin Portal", secret);
  return {
    secret,
    encryptedSecret: encryptSecret(secret),
    otpauth
  };
}

/**
 * Generates 10 recovery codes, returns plain codes and their hashes
 */
export function generateRecoveryCodes() {
  const plainCodes = Array.from({ length: 10 }, () => crypto.randomBytes(4).toString("hex").toUpperCase());
  const hashedCodes = plainCodes.map(code => hashRecoveryCode(code));
  return { plainCodes, hashedCodes };
}
