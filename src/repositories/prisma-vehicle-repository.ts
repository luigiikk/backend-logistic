import { prisma } from "@/lib/prisma.js";
import { VehicleUpdateParams } from "@/services/vehicle/updateVehicle.js";
import { Prisma } from "@prisma/client";

export class PrismaVehiclesRepository {
  async create(data: Prisma.VehiclesCreateInput) {
    const vehicle = await prisma.vehicles.create({
      data,
    });

    return vehicle;
  }

  async getAllVehiclesByCompany(company_id: number) {
  return await prisma.vehicles.findMany({
    where: { company_id }, 
    select: {
      id: true,
      plate: true,
      model: true,
      capacity: true,
      company_id: true,
      status: {
        select: {
          name: true,
        },
      },
    },
  });
}


  async getVehicle(id: number, company_id: number) {
    const vehicle = await prisma.vehicles.findUnique({
      where: {
        id,
        company_id,
      },
      include: {
      status: true, 
    },
    });

    return vehicle;
  }

  async deleteVehicle(id: number) {
    await prisma.vehicles.delete({
      where: {
        id,
      },
    });
  }

  async updateVehicle(
    id: number,
    company_id: number,
    data: VehicleUpdateParams
  ) {
    const vehicleExists = await prisma.vehicles.findUnique({ where: { id } });

    if (!vehicleExists) {
      throw new Error("vehicle not found");
    }

    if (company_id != vehicleExists.company_id) {
      throw new Error("vehicle not update");
    }

    await prisma.vehicles.update({
      where: { id },
      data,
    });
  }
}
