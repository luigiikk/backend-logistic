import { prisma } from "@/lib/prisma.js";
import { PrismaVehiclesRepository } from "@/repositories/prisma-vehicle-repository.js";

export async function deleteVehicleService(id: number) {
  const vehicle = await prisma.vehicles.findFirst({
    where: {
      id,
    },
  });

  if (!vehicle) {
    throw new Error("Vehicle not found");
  }

  const prismaVehiclesRepository = new PrismaVehiclesRepository();

  try {
    await prismaVehiclesRepository.deleteVehicle(vehicle.id);
  } catch (error) {
    throw new Error("Error deleting vechile");
  }
  return vehicle;
}
