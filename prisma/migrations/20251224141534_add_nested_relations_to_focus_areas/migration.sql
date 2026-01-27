/*
  Warnings:

  - You are about to drop the column `label` on the `FocusAreas` table. All the data in the column will be lost.
  - Added the required column `statsLabel` to the `FocusAreas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statsValue` to the `FocusAreas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `FocusAreas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FocusAreas" DROP COLUMN "label",
ADD COLUMN     "statsLabel" TEXT NOT NULL,
ADD COLUMN     "statsValue" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "InspiringStory" (
    "id" TEXT NOT NULL,
    "speaker" TEXT NOT NULL,
    "story" TEXT NOT NULL,
    "focusAreaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InspiringStory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KeyVoice" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "followers" INTEGER NOT NULL,
    "focusAreaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KeyVoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportingOrganization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "focusAreaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupportingOrganization_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InspiringStory" ADD CONSTRAINT "InspiringStory_focusAreaId_fkey" FOREIGN KEY ("focusAreaId") REFERENCES "FocusAreas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KeyVoice" ADD CONSTRAINT "KeyVoice_focusAreaId_fkey" FOREIGN KEY ("focusAreaId") REFERENCES "FocusAreas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportingOrganization" ADD CONSTRAINT "SupportingOrganization_focusAreaId_fkey" FOREIGN KEY ("focusAreaId") REFERENCES "FocusAreas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
