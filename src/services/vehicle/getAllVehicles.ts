import { PrismaVehiclesRepository } from "@/repositories/prisma-vehicle-repository.js";

export async function getAllVehiclesService() {
  const prismaVehiclesRepository = new PrismaVehiclesRepository();

  const vehicle = await prismaVehiclesRepository.getAllVehicles();

  return vehicle;
}
