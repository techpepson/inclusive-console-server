/*
  Warnings:

  - You are about to drop the column `images` on the `FocusAreas` table. All the data in the column will be lost.
  - Added the required column `description` to the `FocusAreas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `FocusAreas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FocusAreas" DROP COLUMN "images",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL;
