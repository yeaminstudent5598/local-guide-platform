-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "unavailableDates" TIMESTAMP(3)[] DEFAULT ARRAY[]::TIMESTAMP(3)[];
