/*
  Warnings:

  - You are about to drop the column `quantity` on the `resources` table. All the data in the column will be lost.
  - Added the required column `total_volume` to the `warehouses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "purchase_order_items" ADD COLUMN     "volume" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "purchase_orders" ADD COLUMN     "total_volume" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "resources" DROP COLUMN "quantity",
ADD COLUMN     "depth" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "height" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "width" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "warehouses" ADD COLUMN     "total_volume" DOUBLE PRECISION NOT NULL;
