import { prisma } from "@/lib/prisma.js";
import { PrismaVehiclesRepository } from "@/repositories/prisma-vehicle-repository.js";

export async function deleteVehicleService(id: number, company_id: number) {
  const vehicle = await prisma.vehicles.findFirst({
    where: {
      id,
      company_id,
    },
  });
  if (!vehicle) {
    throw new Error("Vehicle not found");
  }

  const prismaVehiclesRepository = new PrismaVehiclesRepository();

  try {
    await prismaVehiclesRepository.deleteVehicle(id, company_id);
  } catch (error) {
    throw new Error("Error deleting vechile");
  }
  return vehicle;
}
