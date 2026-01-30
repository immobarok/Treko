-- AlterTable
ALTER TABLE "trips" ADD COLUMN     "country_id" UUID;

-- CreateTable
CREATE TABLE "categories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "image" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category_details" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "category_id" UUID NOT NULL,
    "popular_places" JSONB,

    CONSTRAINT "category_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_experiences" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category_details_id" UUID NOT NULL,

    CONSTRAINT "customer_experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seasonal_info" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "season" TEXT NOT NULL,
    "weather_celsius" TEXT NOT NULL,
    "weather_fahrenheit" TEXT NOT NULL,
    "highlights" TEXT[],
    "perfect_for" TEXT[],
    "image" TEXT,
    "category_details_id" UUID NOT NULL,

    CONSTRAINT "seasonal_info_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "category_details_category_id_key" ON "category_details"("category_id");

-- CreateIndex
CREATE INDEX "trips_country_id_idx" ON "trips"("country_id");

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_details" ADD CONSTRAINT "category_details_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_experiences" ADD CONSTRAINT "customer_experiences_category_details_id_fkey" FOREIGN KEY ("category_details_id") REFERENCES "category_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seasonal_info" ADD CONSTRAINT "seasonal_info_category_details_id_fkey" FOREIGN KEY ("category_details_id") REFERENCES "category_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;
