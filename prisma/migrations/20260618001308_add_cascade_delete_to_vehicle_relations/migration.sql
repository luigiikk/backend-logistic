-- DropForeignKey
ALTER TABLE "vehicle_documents" DROP CONSTRAINT "vehicle_documents_vehicle_id_fkey";

-- DropForeignKey
ALTER TABLE "vehicle_maintenance" DROP CONSTRAINT "vehicle_maintenance_vehicle_id_fkey";

-- AddForeignKey
ALTER TABLE "vehicle_documents" ADD CONSTRAINT "vehicle_documents_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_maintenance" ADD CONSTRAINT "vehicle_maintenance_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
