import { PrismaVehiclesRepository } from "@/repositories/prisma-vehicle-repository.js";

export async function getAllVehiclesByCompanyService(company_id: number, status?: string) {
  const prismaVehiclesRepository = new PrismaVehiclesRepository();

  const vehicle = await prismaVehiclesRepository.getAllVehiclesByCompany(company_id, status);

  return vehicle;
}
