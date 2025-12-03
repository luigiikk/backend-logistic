import { PrismaVehiclesRepository } from "@/repositories/prisma-vehicle-repository.js";

export async function getAllVehiclesByCompanyService() {
  const prismaVehiclesRepository = new PrismaVehiclesRepository();

  const vehicle = await prismaVehiclesRepository.getAllVehiclesByCompany();

  return vehicle;
}
