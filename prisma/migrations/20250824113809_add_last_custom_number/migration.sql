/*
  Warnings:

  - You are about to drop the column `lastCustomNumber` on the `items` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."inventories" ADD COLUMN     "lastCustomNumber" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."items" DROP COLUMN "lastCustomNumber";
