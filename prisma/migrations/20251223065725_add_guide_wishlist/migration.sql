/*
  Warnings:

  - A unique constraint covering the columns `[userId,guideId]` on the table `Wishlist` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Wishlist" ADD COLUMN     "guideId" TEXT,
ALTER COLUMN "listingId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Wishlist_guideId_idx" ON "Wishlist"("guideId");

-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_userId_guideId_key" ON "Wishlist"("userId", "guideId");

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
