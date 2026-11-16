import { createClient } from "@supabase/supabase-js";
import {
  DEFAULT_APP_CONFIG,
  DEFAULT_BIRTHDAY_WISHES,
  DEFAULT_MEMORY_QUESTS,
  DEFAULT_PHOTO_VAULT
} from "./defaultData";

// ============================================================================
// KONFIGURASI OTOMATIS DATABASE CLOUD SUPABASE BARU (ultah-apiw-25)
// URL: https://giimxsinwglzrawfdtff.supabase.co
// Key: sb_publishable_PgxwydhlDvcSex8wEQwTqA_aGTJtZIa
// ============================================================================

export const BUILTIN_SUPABASE_URL = "https://giimxsinwglzrawfdtff.supabase.co";
export const BUILTIN_SUPABASE_KEY = "sb_publishable_PgxwydhlDvcSex8wEQwTqA_aGTJtZIa";

export const isSupabaseConfigured = true;

export const supabase = createClient(BUILTIN_SUPABASE_URL, BUILTIN_SUPABASE_KEY, {
  auth: { persistSession: false }
});

// Penyimpanan fallback di memori server jika sewaktu-waktu offline
if (!globalThis.__APIW_ARCADE_STORE__) {
  globalThis.__APIW_ARCADE_STORE__ = {
    appConfig: { ...DEFAULT_APP_CONFIG },
    memoryQuests: [...DEFAULT_MEMORY_QUESTS],
    photoVault: [...DEFAULT_PHOTO_VAULT],
    birthdayWishes: [...DEFAULT_BIRTHDAY_WISHES]
  };
}

export const memoryStore = globalThis.__APIW_ARCADE_STORE__;

// Format Waktu Baku WIB (Asia/Jakarta): dd/MM/yyyy HH:mm:ss
export function getJakartaTimestamp() {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });
  return formatter.format(now).replace(/\./g, ":");
}

// Generator Kode Unik Sekuensial Anti-Tabrakan (MAX + 1)
export function generateSequentialId(prefix, existingIds = []) {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const periodPrefix = `${prefix}-${yyyy}${mm}${dd}-`;

  let maxNum = 0;
  for (const rawId of existingIds) {
    if (typeof rawId === "string" && rawId.startsWith(prefix + "-")) {
      const parts = rawId.split("-");
      const lastPart = parseInt(parts[parts.length - 1], 10);
      if (!Number.isNaN(lastPart) && lastPart > maxNum) {
        maxNum = lastPart;
      }
    }
  }

  const nextNum = String(maxNum + 1).padStart(3, "0");
  return `${periodPrefix}${nextNum}`;
}
