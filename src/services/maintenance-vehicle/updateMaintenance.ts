import { UpdateVehicleMaintenanceParams, PrismaVehicleMaintenanceRepository } from "@/repositories/prisma-vehicle-maintenance-repository.js";

export async function updateVehicleMaintenanceService(
  id: number,
  vehicle_id: number,
  company_id: number,
  data: UpdateVehicleMaintenanceParams
) {
  const repository = new PrismaVehicleMaintenanceRepository();
 
  const updated = await repository.updateMaintenance(
    id,
    vehicle_id,
    company_id,
    data
  );
 
  return updated;
}