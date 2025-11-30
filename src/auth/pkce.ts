export interface PkcePair {
  code_verifier: string;
  code_challenge: string;
}

export function generateRandomString(length = 64): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let result = "";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  array.forEach((x) => {
    result += chars[x % chars.length];
  });
  return result;
}

export async function sha256(str: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  return crypto.subtle.digest("SHA-256", data);
}

export function base64url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let str = "";
  bytes.forEach((b) => (str += String.fromCharCode(b)));
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function generatePkcePair(): Promise<PkcePair> {
  const code_verifier = generateRandomString();
  const hash = await sha256(code_verifier);
  const code_challenge = base64url(hash);
  return { code_verifier, code_challenge };
}
