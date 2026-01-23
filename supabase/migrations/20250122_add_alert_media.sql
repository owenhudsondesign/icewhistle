-- Add AlertMedia table for anonymous photo/video uploads
-- IMPORTANT: No user data is stored. Media is completely anonymous.
-- Files are stored on Bunny.net, only URLs are stored here.

CREATE TABLE IF NOT EXISTS "AlertMedia" (
    "id" TEXT NOT NULL,
    "alertId" TEXT NOT NULL,

    -- Media type: "image" or "video"
    "mediaType" TEXT NOT NULL,

    -- Bunny.net references (NO user data stored)
    "bunnyId" TEXT,                    -- Bunny Stream video GUID (for videos only)
    "storageUrl" TEXT NOT NULL,        -- Bunny CDN URL for serving
    "thumbnailUrl" TEXT,               -- Video thumbnail or image thumbnail

    -- Content metadata (NO EXIF - stripped client-side before upload)
    "caption" TEXT,                    -- Optional user-provided caption
    "durationSeconds" INTEGER,         -- Video duration only
    "fileSizeBytes" INTEGER,

    -- Status tracking
    "status" TEXT NOT NULL DEFAULT 'processing',  -- "processing", "ready", "failed"
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AlertMedia_pkey" PRIMARY KEY ("id")
);

-- Foreign key to Alert (cascades on delete - when alert expires, media refs are removed)
ALTER TABLE "AlertMedia" ADD CONSTRAINT "AlertMedia_alertId_fkey"
    FOREIGN KEY ("alertId") REFERENCES "Alert"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Indexes for efficient queries
CREATE INDEX "AlertMedia_alertId_idx" ON "AlertMedia"("alertId");
CREATE INDEX "AlertMedia_status_idx" ON "AlertMedia"("status");

-- Add comment explaining the privacy model
COMMENT ON TABLE "AlertMedia" IS 'Anonymous media attachments for community alerts. NO user data is stored. Media files are hosted on Bunny.net CDN. All EXIF/metadata is stripped client-side before upload.';
COMMENT ON COLUMN "AlertMedia"."bunnyId" IS 'Bunny Stream video GUID - used for video management only, not user tracking';
COMMENT ON COLUMN "AlertMedia"."storageUrl" IS 'Public CDN URL - random UUID filename, no user information';
