-- ============================================================================
-- SUPABASE POSTGRESQL SCHEMA (SAFE MIGRATION & NON-DESTRUCTIVE)
-- Projek: APIW.EXE // Happy Birthday 25 Babee ! <3 (17 November)
-- Cara Pakai: Copy-Paste seluruh isi file ini ke menu "SQL Editor" di Supabase lalu klik RUN
-- ============================================================================

CREATE TABLE IF NOT EXISTS "AppConfig" (
  "id" TEXT PRIMARY KEY,
  "dashboardTitle" TEXT NOT NULL,
  "dashboardWish" TEXT NOT NULL,
  "winMessage" TEXT NOT NULL,
  "winPhotosJson" TEXT NOT NULL,
  "spotifyBarcodeUrl" TEXT NOT NULL,
  "dateDay" TEXT NOT NULL,
  "dateLocation" TEXT NOT NULL,
  "dateTimePlan" TEXT NOT NULL,
  "dateNote" TEXT NOT NULL,
  "updatedAt" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "MemoryQuests" (
  "id" TEXT PRIMARY KEY,
  "questCode" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "eventDate" TEXT NOT NULL,
  "story" TEXT NOT NULL,
  "badgeText" TEXT NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS "PhotoVault" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "imageUrl" TEXT NOT NULL,
  "caption" TEXT NOT NULL,
  "dateTaken" TEXT NOT NULL,
  "createdAt" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "BirthdayWishes" (
  "id" TEXT PRIMARY KEY,
  "senderName" TEXT NOT NULL,
  "dateStatus" TEXT NOT NULL,
  "preferredSpot" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "createdAt" TEXT NOT NULL
);

ALTER TABLE "AppConfig" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MemoryQuests" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PhotoVault" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BirthdayWishes" ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'AppConfig' AND policyname = 'Public Access AppConfig') THEN
    CREATE POLICY "Public Access AppConfig" ON "AppConfig" FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'MemoryQuests' AND policyname = 'Public Access MemoryQuests') THEN
    CREATE POLICY "Public Access MemoryQuests" ON "MemoryQuests" FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'PhotoVault' AND policyname = 'Public Access PhotoVault') THEN
    CREATE POLICY "Public Access PhotoVault" ON "PhotoVault" FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'BirthdayWishes' AND policyname = 'Public Access BirthdayWishes') THEN
    CREATE POLICY "Public Access BirthdayWishes" ON "BirthdayWishes" FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;
