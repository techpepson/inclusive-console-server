-- AlterTable
ALTER TABLE "Sponsor" ADD COLUMN     "about_id" TEXT;

-- AlterTable
ALTER TABLE "TeamMember" ADD COLUMN     "about_id" TEXT;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_about_id_fkey" FOREIGN KEY ("about_id") REFERENCES "About"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sponsor" ADD CONSTRAINT "Sponsor_about_id_fkey" FOREIGN KEY ("about_id") REFERENCES "About"("id") ON DELETE SET NULL ON UPDATE CASCADE;
