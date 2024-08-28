import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// utils/encryption.ts

// Function to generate a new encryption key
export async function generateKey(): Promise<CryptoKey> {
  return window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256
    },
    true,
    ["encrypt", "decrypt"]
  );
}

// Function to export the key as base64 for storage
export async function exportKey(key: CryptoKey): Promise<string> {
  const exported = await window.crypto.subtle.exportKey("raw", key);
  return btoa(String.fromCharCode(...new Uint8Array(exported)));
}

// Function to import a key from base64
export async function importKey(keyBase64: string): Promise<CryptoKey> {
  const keyBuffer = Uint8Array.from(atob(keyBase64), c => c.charCodeAt(0));
  return window.crypto.subtle.importKey(
    "raw",
    keyBuffer,
    {
      name: "AES-GCM",
      length: 256
    },
    true,
    ["encrypt", "decrypt"]
  );
}

export async function encryptNote(content: string, key: CryptoKey): Promise<Uint8Array> {
  const encodedContent = new TextEncoder().encode(content);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encryptedContent = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    key,
    encodedContent
  );
  const result = new Uint8Array(iv.length + encryptedContent.byteLength);
  result.set(iv);
  result.set(new Uint8Array(encryptedContent), iv.length);
  return result;
}


// Function to decrypt the note content
export async function decryptNote(encryptedContent: Uint8Array, key: CryptoKey): Promise<string> {
  const iv = encryptedContent.slice(0, 12);
  const data = encryptedContent.slice(12);
  const decryptedContent = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    key,
    data.buffer
  );
  return new TextDecoder().decode(decryptedContent);
}



function uint8ArrayToString(uint8Array : Uint8Array) {
  return new TextDecoder().decode(uint8Array);
}

export function hexToUint8Array(hexString : string) {
  let modifiedHexString = hexString;
  if (modifiedHexString.startsWith('\\x')) {
      modifiedHexString = modifiedHexString.slice(2);
  }
  const bytes = [];
  for (let i = 0; i < modifiedHexString.length; i += 2) {
      bytes.push(Number.parseInt(modifiedHexString.substr(i, 2), 16));
  }
  const jsonString = uint8ArrayToString(new Uint8Array(bytes));

  const json = JSON.parse(jsonString);

  const result =  Object.keys(json).map((key) => json[key]);
  return new Uint8Array(result);
}

