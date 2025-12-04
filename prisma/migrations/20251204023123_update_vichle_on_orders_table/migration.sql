-- DropForeignKey
ALTER TABLE "public"."orders" DROP CONSTRAINT "orders_vehicle_id_fkey";

-- AlterTable
ALTER TABLE "public"."orders" ALTER COLUMN "vehicle_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
