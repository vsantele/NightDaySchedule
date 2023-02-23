-- CreateEnum
CREATE TYPE "State" AS ENUM ('WORK', 'REST');

-- CreateTable
CREATE TABLE "Schedule" (
    "emailAddress" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "start" TIMESTAMP(3),
    "end" TIMESTAMP(3),
    "state" "State" NOT NULL DEFAULT 'WORK',
    "place" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("emailAddress","date")
);
