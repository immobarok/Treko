/*
  Warnings:

  - You are about to drop the column `image` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `category_details_id` on the `customer_experiences` table. All the data in the column will be lost.
  - You are about to drop the column `category_details_id` on the `seasonal_info` table. All the data in the column will be lost.
  - You are about to drop the `category_details` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `place_details_id` to the `customer_experiences` table without a default value. This is not possible if the table is not empty.
  - Added the required column `place_details_id` to the `seasonal_info` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "category_details" DROP CONSTRAINT "category_details_category_id_fkey";

-- DropForeignKey
ALTER TABLE "customer_experiences" DROP CONSTRAINT "customer_experiences_category_details_id_fkey";

-- DropForeignKey
ALTER TABLE "seasonal_info" DROP CONSTRAINT "seasonal_info_category_details_id_fkey";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "image";

-- AlterTable
ALTER TABLE "customer_experiences" DROP COLUMN "category_details_id",
ADD COLUMN     "place_details_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "seasonal_info" DROP COLUMN "category_details_id",
ADD COLUMN     "place_details_id" UUID NOT NULL;

-- DropTable
DROP TABLE "category_details";

-- CreateTable
CREATE TABLE "places" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "category_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "places_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "place_details" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "place_id" UUID NOT NULL,
    "popular_places" JSONB,

    CONSTRAINT "place_details_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "place_details_place_id_key" ON "place_details"("place_id");

-- AddForeignKey
ALTER TABLE "places" ADD CONSTRAINT "places_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "place_details" ADD CONSTRAINT "place_details_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "places"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_experiences" ADD CONSTRAINT "customer_experiences_place_details_id_fkey" FOREIGN KEY ("place_details_id") REFERENCES "place_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seasonal_info" ADD CONSTRAINT "seasonal_info_place_details_id_fkey" FOREIGN KEY ("place_details_id") REFERENCES "place_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;
