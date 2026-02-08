-- CreateTable
CREATE TABLE "LandingPage" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LandingPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutSection" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "founderName" TEXT NOT NULL,
    "founderRole" TEXT NOT NULL,
    "signatureUrl" TEXT NOT NULL,
    "images" TEXT[],
    "landingPageId" INTEGER NOT NULL,

    CONSTRAINT "AboutSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BestServices" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "promoBanner" TEXT NOT NULL,
    "landingPageId" INTEGER NOT NULL,

    CONSTRAINT "BestServices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceItem" (
    "id" SERIAL NOT NULL,
    "icon" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "bestServicesId" INTEGER NOT NULL,

    CONSTRAINT "ServiceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JourneyTimeline" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "historyTitle" TEXT NOT NULL,
    "historyDesc" TEXT NOT NULL,
    "landingPageId" INTEGER NOT NULL,

    CONSTRAINT "JourneyTimeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimelineEvent" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "journeyTimelineId" INTEGER NOT NULL,

    CONSTRAINT "TimelineEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhyChooseUs" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "landingPageId" INTEGER NOT NULL,

    CONSTRAINT "WhyChooseUs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feature" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "whyChooseUsId" INTEGER NOT NULL,

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Partner" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "landingPageId" INTEGER NOT NULL,

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoSection" (
    "id" SERIAL NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "landingPageId" INTEGER NOT NULL,

    CONSTRAINT "VideoSection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AboutSection_landingPageId_key" ON "AboutSection"("landingPageId");

-- CreateIndex
CREATE UNIQUE INDEX "BestServices_landingPageId_key" ON "BestServices"("landingPageId");

-- CreateIndex
CREATE UNIQUE INDEX "JourneyTimeline_landingPageId_key" ON "JourneyTimeline"("landingPageId");

-- CreateIndex
CREATE UNIQUE INDEX "WhyChooseUs_landingPageId_key" ON "WhyChooseUs"("landingPageId");

-- CreateIndex
CREATE UNIQUE INDEX "VideoSection_landingPageId_key" ON "VideoSection"("landingPageId");

-- AddForeignKey
ALTER TABLE "AboutSection" ADD CONSTRAINT "AboutSection_landingPageId_fkey" FOREIGN KEY ("landingPageId") REFERENCES "LandingPage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BestServices" ADD CONSTRAINT "BestServices_landingPageId_fkey" FOREIGN KEY ("landingPageId") REFERENCES "LandingPage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceItem" ADD CONSTRAINT "ServiceItem_bestServicesId_fkey" FOREIGN KEY ("bestServicesId") REFERENCES "BestServices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JourneyTimeline" ADD CONSTRAINT "JourneyTimeline_landingPageId_fkey" FOREIGN KEY ("landingPageId") REFERENCES "LandingPage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimelineEvent" ADD CONSTRAINT "TimelineEvent_journeyTimelineId_fkey" FOREIGN KEY ("journeyTimelineId") REFERENCES "JourneyTimeline"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhyChooseUs" ADD CONSTRAINT "WhyChooseUs_landingPageId_fkey" FOREIGN KEY ("landingPageId") REFERENCES "LandingPage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feature" ADD CONSTRAINT "Feature_whyChooseUsId_fkey" FOREIGN KEY ("whyChooseUsId") REFERENCES "WhyChooseUs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partner" ADD CONSTRAINT "Partner_landingPageId_fkey" FOREIGN KEY ("landingPageId") REFERENCES "LandingPage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoSection" ADD CONSTRAINT "VideoSection_landingPageId_fkey" FOREIGN KEY ("landingPageId") REFERENCES "LandingPage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
