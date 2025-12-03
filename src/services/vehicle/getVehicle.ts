import { PrismaVehiclesRepository } from "@/repositories/prisma-vehicle-repository.js";

export async function getVehicleService(id: number, company_id: number) {
  const prismaVehiclesRepository = new PrismaVehiclesRepository();

  const vehicle = await prismaVehiclesRepository.getVehicle(id, company_id);

  if (!vehicle) {
    throw new Error("Vehicle not found");
  }
  return vehicle;
}
