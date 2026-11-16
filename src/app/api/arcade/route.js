import { NextResponse } from "next/server";
import {
  DEFAULT_APP_CONFIG,
  DEFAULT_BIRTHDAY_WISHES,
  DEFAULT_MEMORY_QUESTS,
  DEFAULT_PHOTO_VAULT
} from "../../../lib/defaultData";
import {
  generateSequentialId,
  getJakartaTimestamp,
  isSupabaseConfigured,
  memoryStore,
  supabase
} from "../../../lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0"
};

// Pemisah khusus untuk menyimpan foto opsional di dalam kolom story (TEXT) pada tabel MemoryQuests
// sehingga 100% kompatibel dengan tabel Supabase yang sudah ada tanpa perlu ALTER TABLE
const QUEST_IMG_SEPARATOR = "\n___QUEST_IMG_DATA___\n";

function packQuestStoryAndImage(storyText, imageUrl) {
  const cleanStory = typeof storyText === "string" ? storyText.trim() : "";
  const cleanImg = typeof imageUrl === "string" ? imageUrl.trim() : "";
  if (!cleanImg) return cleanStory;
  return `${cleanStory}${QUEST_IMG_SEPARATOR}${cleanImg}`;
}

function unpackQuestRow(row) {
  if (!row) return row;
  const rawStory = typeof row.story === "string" ? row.story : "";
  if (rawStory.includes(QUEST_IMG_SEPARATOR)) {
    const [pureStory, packedImg] = rawStory.split(QUEST_IMG_SEPARATOR);
    return {
      ...row,
      story: pureStory,
      imageUrl: row.imageUrl || packedImg || ""
    };
  }
  return {
    ...row,
    imageUrl: row.imageUrl || ""
  };
}

// Daftar PIN resmi yang SELALU DITERIMA (250325 & 25032025 + env var jika ada)
function isValidAdminPin(inputPin) {
  const clean = String(inputPin || "").trim();
  const envPin = String(process.env.ADMIN_SECRET_PIN || "").trim();
  const allowedPins = new Set(["250325", "25032025", "1711", "171101"]);
  if (envPin) allowedPins.add(envPin);
  return allowedPins.has(clean);
}

function sanitizeText(val, maxLen = 4000) {
  if (typeof val !== "string") return "";
  return val.trim().slice(0, maxLen);
}

// Pastikan tabel Supabase terisi data awal jika baru pertama kali dijalankan (Safe Migration)
async function ensureSupabaseSeeded() {
  if (!isSupabaseConfigured || !supabase) return;

  try {
    const { data: cfg } = await supabase.from("AppConfig").select("id").limit(1);
    if (!cfg || cfg.length === 0) {
      await supabase.from("AppConfig").upsert([DEFAULT_APP_CONFIG]);
    }

    const { data: quests } = await supabase.from("MemoryQuests").select("id").limit(1);
    if (!quests || quests.length === 0) {
      const dbQuests = DEFAULT_MEMORY_QUESTS.map((q) => ({
        id: q.id,
        questCode: q.questCode,
        title: q.title,
        eventDate: q.eventDate,
        story: packQuestStoryAndImage(q.story, q.imageUrl),
        badgeText: q.badgeText,
        sortOrder: q.sortOrder
      }));
      await supabase.from("MemoryQuests").upsert(dbQuests);
    }

    const { data: photos } = await supabase.from("PhotoVault").select("id").limit(1);
    if (!photos || photos.length === 0) {
      await supabase.from("PhotoVault").upsert(DEFAULT_PHOTO_VAULT);
    }

    const { data: wishes } = await supabase.from("BirthdayWishes").select("id").limit(1);
    if (!wishes || wishes.length === 0) {
      await supabase.from("BirthdayWishes").upsert(DEFAULT_BIRTHDAY_WISHES);
    }
  } catch (err) {
    console.warn("Supabase seed check warning:", err?.message || err);
  }
}

// GET /api/arcade?section=all|wishes&search=...&limit=10&offset=0
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section") || "all";
    const search = (searchParams.get("search") || "").trim().toLowerCase();
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "20", 10), 1), 100);
    const offset = Math.max(parseInt(searchParams.get("offset") || "0", 0), 0);

    if (isSupabaseConfigured && supabase) {
      await ensureSupabaseSeeded();

      if (section === "wishes") {
        let query = supabase
          .from("BirthdayWishes")
          .select("*", { count: "exact" })
          .order("id", { ascending: false })
          .range(offset, offset + limit - 1);

        if (search) {
          query = query.or(
            `senderName.ilike.%${search}%,message.ilike.%${search}%,preferredSpot.ilike.%${search}%`
          );
        }

        const { data, count, error } = await query;
        if (!error && data) {
          return NextResponse.json({
            ok: true,
            source: "supabase",
            wishes: data,
            totalWishes: count ?? data.length
          });
        }
      }

      const [cfgRes, questRes, photoRes, wishRes] = await Promise.all([
        supabase.from("AppConfig").select("*").eq("id", "CFG-MAIN-001").single(),
        supabase.from("MemoryQuests").select("*").order("sortOrder", { ascending: true }),
        supabase.from("PhotoVault").select("*").order("id", { ascending: true }),
        supabase
          .from("BirthdayWishes")
          .select("*", { count: "exact" })
          .order("id", { ascending: false })
          .range(offset, offset + limit - 1)
      ]);

      if (!cfgRes.error && !questRes.error && !photoRes.error && !wishRes.error) {
        const unpackedQuests = (questRes.data || DEFAULT_MEMORY_QUESTS).map(unpackQuestRow);
        return NextResponse.json(
          {
            ok: true,
            source: "supabase",
            appConfig: cfgRes.data || DEFAULT_APP_CONFIG,
            memoryQuests: unpackedQuests,
            photoVault: photoRes.data || DEFAULT_PHOTO_VAULT,
            birthdayWishes: wishRes.data || DEFAULT_BIRTHDAY_WISHES,
            totalWishes: wishRes.count ?? (wishRes.data ? wishRes.data.length : 0)
          },
          { headers: NO_CACHE_HEADERS }
        );
      }
    }

    // Fallback Memory Store
    let filteredWishes = [...memoryStore.birthdayWishes].reverse();
    if (search) {
      filteredWishes = filteredWishes.filter(
        (w) =>
          w.senderName.toLowerCase().includes(search) ||
          w.message.toLowerCase().includes(search) ||
          w.preferredSpot.toLowerCase().includes(search)
      );
    }
    const pagedWishes = filteredWishes.slice(offset, offset + limit);

    if (section === "wishes") {
      return NextResponse.json({
        ok: true,
        source: "memory-fallback",
        wishes: pagedWishes,
        totalWishes: filteredWishes.length
      });
    }

    return NextResponse.json({
      ok: true,
      source: "memory-fallback",
      appConfig: memoryStore.appConfig,
      memoryQuests: [...memoryStore.memoryQuests]
        .map(unpackQuestRow)
        .sort((a, b) => a.sortOrder - b.sortOrder),
      photoVault: memoryStore.photoVault,
      birthdayWishes: pagedWishes,
      totalWishes: filteredWishes.length
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error?.message || "Gagal memuat data aplikasi." },
      { status: 500 }
    );
  }
}

// POST /api/arcade
export async function POST(request) {
  try {
    const body = await request.json();
    const action = sanitizeText(body.action, 50);

    // 1. Verifikasi PIN Rahasia Pasangan (Selalu menerima 250325 & 25032025)
    if (action === "verifyPin") {
      if (isValidAdminPin(body.pin)) {
        return NextResponse.json({
          ok: true,
          message: "PIN 250325 Terverifikasi! Mode Edit Pasangan Aktif <3"
        });
      }
      return NextResponse.json(
        { ok: false, error: "PIN salah! Gunakan tanggal jadian 250325." },
        { status: 401 }
      );
    }

    // 2. Simpan Ucapan Balasan Apiw & Konfirmasi Date Kamis Blok M (Terbuka untuk Apiw tanpa PIN)
    if (action === "addWish") {
      const senderName = sanitizeText(body.senderName || "Apiw (Birthday Boy)", 80);
      const dateStatus = sanitizeText(body.dateStatus || "SIAP GAS BLOK M KAMIS! 🚀", 60);
      const preferredSpot = sanitizeText(
        body.preferredSpot || "Jalan & Kulineran Bareng di Blok M",
        120
      );
      const message = sanitizeText(body.message, 2000);

      if (!senderName || !message) {
        return NextResponse.json(
          { ok: false, error: "Nama dan isi pesan balasan tidak boleh kosong ya sayang!" },
          { status: 400 }
        );
      }

      const createdAt = getJakartaTimestamp();

      if (isSupabaseConfigured && supabase) {
        const { data: existingRows } = await supabase.from("BirthdayWishes").select("id");
        const existingIds = (existingRows || []).map((r) => r.id);
        const newId = generateSequentialId("WSH", existingIds);

        const newWish = {
          id: newId,
          senderName,
          dateStatus,
          preferredSpot,
          message,
          createdAt
        };

        const { error } = await supabase.from("BirthdayWishes").insert([newWish]);
        if (!error) {
          return NextResponse.json({ ok: true, item: newWish, source: "supabase" });
        }
      }

      const existingIds = memoryStore.birthdayWishes.map((w) => w.id);
      const newWish = {
        id: generateSequentialId("WSH", existingIds),
        senderName,
        dateStatus,
        preferredSpot,
        message,
        createdAt
      };
      memoryStore.birthdayWishes.push(newWish);
      return NextResponse.json({ ok: true, item: newWish, source: "memory-fallback" });
    }

    // Untuk aksi edit/tambah cerita, foto, barcode Spotify, dan konfigurasi wajib PIN 250325
    if (!isValidAdminPin(body.pin)) {
      return NextResponse.json(
        { ok: false, error: "Akses ditolak: Masukkan PIN tanggal jadian (250325) terlebih dahulu." },
        { status: 401 }
      );
    }

    // 3. Tambah atau Edit Cerita Perjalanan Cinta + 1 Foto Opsional (Stage 1: MemoryQuests)
    if (action === "saveQuest") {
      const questCode = sanitizeText(body.questCode || "OUR CHAPTER", 40);
      const title = sanitizeText(body.title, 120);
      const eventDate = sanitizeText(body.eventDate, 50);
      const story = sanitizeText(body.story, 5000);
      const imageUrl = sanitizeText(body.imageUrl || "", 2500000); // Foto opsional (boleh kosong)
      const badgeText = sanitizeText(body.badgeText || "+1000 LOVE XP", 50);
      const sortOrder = Number(body.sortOrder) || 1;

      if (!title || !story) {
        return NextResponse.json(
          { ok: false, error: "Judul cerita dan isi kisah tidak boleh kosong." },
          { status: 400 }
        );
      }

      const packedStoryForDb = packQuestStoryAndImage(story, imageUrl);

      if (isSupabaseConfigured && supabase) {
        const { data: existingRows } = await supabase.from("MemoryQuests").select("id");
        const existingIds = (existingRows || []).map((r) => r.id);
        const questId = body.id ? sanitizeText(body.id, 30) : generateSequentialId("QST", existingIds);

        const dbRow = {
          id: questId,
          questCode,
          title,
          eventDate,
          story: packedStoryForDb,
          badgeText,
          sortOrder
        };
        const { error } = await supabase.from("MemoryQuests").upsert([dbRow]);
        if (!error) {
          return NextResponse.json({
            ok: true,
            item: { id: questId, questCode, title, eventDate, story, imageUrl, badgeText, sortOrder },
            source: "supabase"
          });
        }
      }

      const existingIds = memoryStore.memoryQuests.map((q) => q.id);
      const questId = body.id ? sanitizeText(body.id, 30) : generateSequentialId("QST", existingIds);
      const item = { id: questId, questCode, title, eventDate, story, imageUrl, badgeText, sortOrder };

      const idx = memoryStore.memoryQuests.findIndex((q) => q.id === questId);
      if (idx >= 0) {
        memoryStore.memoryQuests[idx] = item;
      } else {
        memoryStore.memoryQuests.push(item);
      }
      return NextResponse.json({ ok: true, item, source: "memory-fallback" });
    }

    // 4. Hapus Cerita (Stage 1)
    if (action === "deleteQuest") {
      const targetId = sanitizeText(body.id, 30);
      if (isSupabaseConfigured && supabase) {
        await supabase.from("MemoryQuests").delete().eq("id", targetId);
      }
      memoryStore.memoryQuests = memoryStore.memoryQuests.filter((q) => q.id !== targetId);
      return NextResponse.json({ ok: true, deletedId: targetId });
    }

    // 5. Tambah atau Edit Momen Foto Kenangan Multi-Foto (Stage 2: PhotoVault)
    if (action === "savePhoto") {
      const title = sanitizeText(body.title, 100);
      const imageUrl = sanitizeText(body.imageUrl, 6000000); // Mendukung JSON array multi-foto atau 1 foto
      const caption = sanitizeText(body.caption, 1500);
      const dateTaken = sanitizeText(body.dateTaken || "2025", 50);
      const createdAt = getJakartaTimestamp();

      if (!title || !imageUrl) {
        return NextResponse.json(
          { ok: false, error: "Judul momen dan minimal 1 foto tidak boleh kosong." },
          { status: 400 }
        );
      }

      if (isSupabaseConfigured && supabase) {
        const { data: existingRows } = await supabase.from("PhotoVault").select("id");
        const existingIds = (existingRows || []).map((r) => r.id);
        const photoId = body.id ? sanitizeText(body.id, 30) : generateSequentialId("PHO", existingIds);

        const item = { id: photoId, title, imageUrl, caption, dateTaken, createdAt };
        const { error } = await supabase.from("PhotoVault").upsert([item]);
        if (!error) {
          return NextResponse.json({ ok: true, item, source: "supabase" });
        }
      }

      const existingIds = memoryStore.photoVault.map((p) => p.id);
      const photoId = body.id ? sanitizeText(body.id, 30) : generateSequentialId("PHO", existingIds);
      const item = { id: photoId, title, imageUrl, caption, dateTaken, createdAt };

      const idx = memoryStore.photoVault.findIndex((p) => p.id === photoId);
      if (idx >= 0) {
        memoryStore.photoVault[idx] = item;
      } else {
        memoryStore.photoVault.push(item);
      }
      return NextResponse.json({ ok: true, item, source: "memory-fallback" });
    }

    // 6. Hapus Foto Kenangan (Stage 2)
    if (action === "deletePhoto") {
      const targetId = sanitizeText(body.id, 30);
      if (isSupabaseConfigured && supabase) {
        await supabase.from("PhotoVault").delete().eq("id", targetId);
      }
      memoryStore.photoVault = memoryStore.photoVault.filter((p) => p.id !== targetId);
      return NextResponse.json({ ok: true, deletedId: targetId });
    }

    // 7. Update Konfigurasi Dashboard, Hadiah Game, Barcode Spotify & Undangan Date Kamis Blok M
    if (action === "saveConfig") {
      const updatedConfig = {
        id: "CFG-MAIN-001",
        dashboardTitle: sanitizeText(
          body.dashboardTitle || memoryStore.appConfig.dashboardTitle,
          150
        ),
        dashboardWish: sanitizeText(
          body.dashboardWish || memoryStore.appConfig.dashboardWish,
          4000
        ),
        winMessage: sanitizeText(body.winMessage || memoryStore.appConfig.winMessage, 4000),
        winPhotosJson:
          typeof body.winPhotosJson === "string"
            ? body.winPhotosJson
            : memoryStore.appConfig.winPhotosJson,
        spotifyBarcodeUrl: sanitizeText(
          body.spotifyBarcodeUrl || memoryStore.appConfig.spotifyBarcodeUrl,
          2500000
        ),
        dateDay: sanitizeText(body.dateDay || memoryStore.appConfig.dateDay, 80),
        dateLocation: sanitizeText(body.dateLocation || memoryStore.appConfig.dateLocation, 120),
        dateTimePlan: sanitizeText(body.dateTimePlan || memoryStore.appConfig.dateTimePlan, 120),
        dateNote: sanitizeText(body.dateNote || memoryStore.appConfig.dateNote, 3000),
        updatedAt: getJakartaTimestamp()
      };

      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from("AppConfig").upsert([updatedConfig]);
        if (!error) {
          memoryStore.appConfig = updatedConfig;
          return NextResponse.json({ ok: true, item: updatedConfig, source: "supabase" });
        }
      }

      memoryStore.appConfig = updatedConfig;
      return NextResponse.json({ ok: true, item: updatedConfig, source: "memory-fallback" });
    }

    return NextResponse.json({ ok: false, error: "Aksi tidak dikenali." }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error?.message || "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
