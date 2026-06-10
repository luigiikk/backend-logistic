import { PrismaVehicleMaintenanceRepository } from "@/repositories/prisma-vehicle-maintenance-repository.js";

export async function deleteVehicleMaintenanceService(
  id: number,
  vehicle_id: number,
  company_id: number
) {
  const repository = new PrismaVehicleMaintenanceRepository();
 
  await repository.deleteMaintenance(id, vehicle_id, company_id);
}