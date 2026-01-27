-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "speaker" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "statement" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);
