import { PrismaVehiclesRepository } from "@/repositories/prisma-vehicle-repository.js";

export interface VehicleUpdateParams {
  plate: string;
  model: string;
  total_volume: number;
  status_id?: number;
}

export async function updateVehicleService(
  id: number, company_id: number,
  { plate, model, total_volume, status_id}: VehicleUpdateParams
) {
  const prismaVehiclesRepository = new PrismaVehiclesRepository();

  await prismaVehiclesRepository.updateVehicle(id, company_id, {
    plate,
    model,
    total_volume,
    status_id,
  });
}
