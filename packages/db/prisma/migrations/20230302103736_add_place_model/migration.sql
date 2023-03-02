-- CreateTable
CREATE TABLE "Place" (
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Place_pkey" PRIMARY KEY ("name")
);

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_place_fkey" FOREIGN KEY ("place") REFERENCES "Place"("name") ON DELETE SET NULL ON UPDATE CASCADE;
