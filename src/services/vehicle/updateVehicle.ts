import { PrismaVehiclesRepository } from "@/repositories/prisma-vehicle-repository.js";

export interface VehicleUpdateParams {
  plate: string;
  model: string;
  capacity: number;
  status_id: number;
}

export async function updateVehicleService(
  id: number, company_id: number,
  { plate, model, capacity, status_id}: VehicleUpdateParams
) {
  const prismaVehiclesRepository = new PrismaVehiclesRepository();

  await prismaVehiclesRepository.updateVehicle(id, company_id, {
    plate,
    model,
    capacity,
    status_id,
  });
}
