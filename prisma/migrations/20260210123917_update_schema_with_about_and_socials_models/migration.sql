-- AlterTable
ALTER TABLE "ContactMessage" ADD COLUMN     "phone" TEXT,
ALTER COLUMN "subject" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Socials" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Socials_pkey" PRIMARY KEY ("id")
);
