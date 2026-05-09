import { prisma } from "@/lib/prisma.js"
import { PrismaVehiclesRepository } from "@/repositories/prisma-vehicle-repository.js"
import { PrismaStatusRepository } from "@/repositories/prisma-status-repository.js";

interface VehicleRegisterParams{
    plate: string;
    model: string;
    total_volume: number;
    status_id?: number;
    company_id: number;
}

export async function registerVehicleService({
  plate,
  model,
  total_volume,
  status_id,
  company_id,
}: VehicleRegisterParams) {


  const vehicleWithSamePlate = await prisma.vehicles.findUnique({
    where: {
      plate,
    },
  });

  if(vehicleWithSamePlate){
    throw new Error("Plate already exists");
  }

  let resolvedStatusId = status_id;

  if (!resolvedStatusId) {
    const prismaStatusRepository = new PrismaStatusRepository();

    const status =
      (await prismaStatusRepository.getDefault(company_id, "vehicle")) ??
      (await prismaStatusRepository.getSystemDefault("vehicle"));

    if (!status) {
      throw new Error("No vehicle status found.");
    }

    resolvedStatusId = status.id;
  }

  const prismaVehiclesRepository = new PrismaVehiclesRepository();

  const vehicle = await prismaVehiclesRepository.create({
    plate,
    model,
    total_volume,
    status: { connect: { id: resolvedStatusId } },
    company: { connect: { id: company_id }},
  });
  return vehicle; 
}