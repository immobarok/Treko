/*
  Warnings:

  - You are about to drop the column `country_id` on the `trips` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `places` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `places` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "trips" DROP CONSTRAINT "trips_country_id_fkey";

-- DropIndex
DROP INDEX "trips_country_id_idx";

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "image" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "customer_experiences" ADD COLUMN     "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "customerName" TEXT,
ADD COLUMN     "rating" DOUBLE PRECISION,
ADD COLUMN     "visitDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "places" ADD COLUMN     "bannerImage" TEXT,
ADD COLUMN     "capital" TEXT,
ADD COLUMN     "currency" TEXT,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "language" TEXT,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "restrictions" TEXT,
ADD COLUMN     "shortDesc" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "timezone" TEXT,
ADD COLUMN     "visaRequired" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "seasonal_info" ADD COLUMN     "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "trips" DROP COLUMN "country_id",
ADD COLUMN     "place_id" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "places_slug_key" ON "places"("slug");

-- CreateIndex
CREATE INDEX "places_category_id_idx" ON "places"("category_id");

-- CreateIndex
CREATE INDEX "places_slug_idx" ON "places"("slug");

-- CreateIndex
CREATE INDEX "trips_place_id_idx" ON "trips"("place_id");

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "places"("id") ON DELETE SET NULL ON UPDATE CASCADE;
