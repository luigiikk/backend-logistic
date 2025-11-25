import { PrismaVehiclesRepository } from "@/repositories/prisma-vehicle-repository.js";

export interface VehicleUpdateParams {
  plate: string;
  model: string;
  capacity: number;
  status_id: number;
  company_id: number;
}

export async function updateVehicleService(
  id: number,
  { plate, model, capacity, status_id, company_id }: VehicleUpdateParams
) {
  const prismaVehiclesRepository = new PrismaVehiclesRepository();

  await prismaVehiclesRepository.updateVehicle(id, {
    plate,
    model,
    capacity,
    status_id,
    company_id,
  });
}
