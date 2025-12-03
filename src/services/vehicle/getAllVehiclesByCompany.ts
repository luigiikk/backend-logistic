import { PrismaVehiclesRepository } from "@/repositories/prisma-vehicle-repository.js";

export async function getAllVehiclesByCompanyService(company_id: number) {
  const prismaVehiclesRepository = new PrismaVehiclesRepository();

  const vehicle = await prismaVehiclesRepository.getAllVehiclesByCompany(company_id);

  return vehicle;
}
