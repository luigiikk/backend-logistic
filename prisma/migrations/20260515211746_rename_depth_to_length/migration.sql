/*
  Warnings:

  - You are about to drop the column `depth` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `depth` on the `resources` table. All the data in the column will be lost.
  - Added the required column `length` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "depth",
ADD COLUMN     "length" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "resources" DROP COLUMN "depth",
ADD COLUMN     "length" DOUBLE PRECISION NOT NULL DEFAULT 0;
