/*
  Warnings:

  - You are about to drop the column `createdAt` on the `About` table. All the data in the column will be lost.
  - You are about to drop the column `missionDescription` on the `About` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `About` table. All the data in the column will be lost.
  - You are about to drop the column `visionDescription` on the `About` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `FocusAreas` table. All the data in the column will be lost.
  - You are about to drop the column `hashTags` on the `FocusAreas` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `FocusAreas` table. All the data in the column will be lost.
  - You are about to drop the column `statsLabel` on the `FocusAreas` table. All the data in the column will be lost.
  - You are about to drop the column `statsValue` on the `FocusAreas` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `FocusAreas` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `mainTitle` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `primaryButtonText` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `secoondaryButtonText` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `subTitle` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Hero` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `ImpactMetric` table. All the data in the column will be lost.
  - You are about to drop the column `growth` on the `ImpactMetric` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ImpactMetric` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Sponsor` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Sponsor` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Statistic` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Statistic` table. All the data in the column will be lost.
  - You are about to drop the column `contact` on the `SupportingOrganization` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `TeamMember` table. All the data in the column will be lost.
  - You are about to drop the column `profilePicture` on the `TeamMember` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `TeamMember` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Testimonial` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Testimonial` table. All the data in the column will be lost.
  - You are about to drop the `CoreValue` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InspiringStory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `mission_description` to the `About` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `About` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vision_description` to the `About` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hashTag` to the `FocusAreas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stats_label` to the `FocusAreas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stats_value` to the `FocusAreas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `FocusAreas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `Hero` table without a default value. This is not possible if the table is not empty.
  - Added the required column `heading` to the `Hero` table without a default value. This is not possible if the table is not empty.
  - Added the required column `primary_button_text` to the `Hero` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secondary_button_text` to the `Hero` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtitle` to the `Hero` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Hero` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by_id` to the `ImpactMetric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `ImpactMetric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Sponsor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by_id` to the `Statistic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Statistic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `SupportingOrganization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `TeamMember` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Testimonial` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'ADMIN_USER');

-- DropForeignKey
ALTER TABLE "InspiringStory" DROP CONSTRAINT "InspiringStory_focusAreaId_fkey";

-- AlterTable
ALTER TABLE "About" DROP COLUMN "createdAt",
DROP COLUMN "missionDescription",
DROP COLUMN "updatedAt",
DROP COLUMN "visionDescription",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "mission_description" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "vision_description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FocusAreas" DROP COLUMN "createdAt",
DROP COLUMN "hashTags",
DROP COLUMN "image",
DROP COLUMN "statsLabel",
DROP COLUMN "statsValue",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "hashTag" TEXT NOT NULL,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "stats_label" TEXT NOT NULL,
ADD COLUMN     "stats_value" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Hero" DROP COLUMN "createdAt",
DROP COLUMN "mainTitle",
DROP COLUMN "primaryButtonText",
DROP COLUMN "secoondaryButtonText",
DROP COLUMN "subTitle",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by" TEXT NOT NULL,
ADD COLUMN     "heading" TEXT NOT NULL,
ADD COLUMN     "primary_button_text" TEXT NOT NULL,
ADD COLUMN     "secondary_button_text" TEXT NOT NULL,
ADD COLUMN     "subtitle" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ImpactMetric" DROP COLUMN "createdAt",
DROP COLUMN "growth",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "value" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "KeyVoice" ALTER COLUMN "followers" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Sponsor" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "website" TEXT,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Statistic" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "value" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "SupportingOrganization" DROP COLUMN "contact",
ADD COLUMN     "email" TEXT NOT NULL,
ALTER COLUMN "website" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TeamMember" DROP COLUMN "createdAt",
DROP COLUMN "profilePicture",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "profile_picture" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Testimonial" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "CoreValue";

-- DropTable
DROP TABLE "InspiringStory";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InspiringStories" (
    "id" TEXT NOT NULL,
    "speaker" TEXT NOT NULL,
    "story" TEXT NOT NULL,
    "focusAreaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InspiringStories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Events" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Hero" ADD CONSTRAINT "Hero_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Statistic" ADD CONSTRAINT "Statistic_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImpactMetric" ADD CONSTRAINT "ImpactMetric_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InspiringStories" ADD CONSTRAINT "InspiringStories_focusAreaId_fkey" FOREIGN KEY ("focusAreaId") REFERENCES "FocusAreas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
