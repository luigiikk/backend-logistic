import { prisma } from "@/lib/prisma.js"
import { PrismaVehiclesRepository } from "@/repositories/prisma-vehicle-repository.js"

interface VehicleRegisterParams{
    plate: string;
    model: string;
    capacity: number;
    status_id: number;
    company_id: number;
}

export async function registerVehicleService({
  plate,
  model,
  capacity,
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


  const prismaVehiclesRepository = new PrismaVehiclesRepository();

  const vehicle = await prismaVehiclesRepository.create({
    plate,
    model,
    capacity,
    status: { connect: { id: status_id } },
    company: { connect: { id: company_id }},
  });
  return vehicle; 
}