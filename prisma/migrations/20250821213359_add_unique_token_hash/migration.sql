/*
  Warnings:

  - You are about to drop the column `ip_address` on the `RefreshToken` table. All the data in the column will be lost.
  - You are about to drop the column `user_agent` on the `RefreshToken` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."RefreshToken" DROP COLUMN "ip_address",
DROP COLUMN "user_agent";

-- CreateIndex
CREATE INDEX "RefreshToken_user_id_idx" ON "public"."RefreshToken"("user_id");

-- CreateIndex
CREATE INDEX "RefreshToken_expires_at_idx" ON "public"."RefreshToken"("expires_at");
