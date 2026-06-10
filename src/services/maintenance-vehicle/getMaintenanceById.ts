import { PrismaVehicleMaintenanceRepository } from "@/repositories/prisma-vehicle-maintenance-repository.js";

export async function getVehicleMaintenanceService(
  id: number,
  vehicle_id: number,
  company_id: number
) {
  const repository = new PrismaVehicleMaintenanceRepository();
 
  const maintenance = await repository.getMaintenance(id, vehicle_id, company_id);
 
  if (!maintenance) {
    throw new Error("Maintenance not found");
  }
 
  return maintenance;
}