/*
  Warnings:

  - You are about to drop the column `capacity` on the `vehicles` table. All the data in the column will be lost.
  - Added the required column `depth` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `height` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `volume` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_volume` to the `vehicles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."products" ADD COLUMN     "depth" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "height" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "volume" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "width" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "quantity" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "public"."vehicles" DROP COLUMN "capacity",
ADD COLUMN     "total_volume" DOUBLE PRECISION NOT NULL;
