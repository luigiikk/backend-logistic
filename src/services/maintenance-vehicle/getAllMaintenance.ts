import { PrismaVehicleMaintenanceRepository } from "@/repositories/prisma-vehicle-maintenance-repository.js";

export async function getAllVehicleMaintenancesService(
  vehicle_id: number,
  company_id: number
) {
  const repository = new PrismaVehicleMaintenanceRepository();
 
  const maintenances = await repository.getAllByVehicle(vehicle_id, company_id);
 
  return maintenances;
}