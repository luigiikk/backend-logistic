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

  async getAllVehicles() {
    return await prisma.vehicles.findMany({
      select: {
        id: true,
        plate: true,
        model: true,
        capacity: true,
        status_id: true,
        company_id: true
      },
    });
  }

  async getVehicle(id: number) {
    const vehicle = await prisma.vehicles.findUnique({
      where: {
        id,
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

  async updateVehicle(id: number, data: VehicleUpdateParams) {
      const vehicleExists = await prisma.vehicles.findUnique({ where: { id } });
  
      if (!vehicleExists) {
        throw new Error("vehicle not found");
      }
      await prisma.vehicles.update({
        where: { id },
        data,
      });
    }
}
