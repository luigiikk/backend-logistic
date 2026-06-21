import { prisma } from "@/lib/prisma.js";
import { VehicleUpdateParams } from "@/services/vehicle/updateVehicle.js";
import { Prisma } from "@prisma/client";
import { ParsedDocumentInput } from "@/repositories/prisma-vehicle-documents-repository.js";
import { ParsedMaintenanceInput } from "@/repositories/prisma-vehicle-maintenance-repository.js";

export interface CreateVehicleInput {
  plate: string;
  model?: string;
  total_volume: number;
  status: Prisma.StatusCreateNestedOneWithoutVehiclesInput;
  company: Prisma.CompaniesCreateNestedOneWithoutVehiclesInput;
  documents?: ParsedDocumentInput[];
  maintenances?: ParsedMaintenanceInput[];
}

export class PrismaVehiclesRepository {
  async create({ documents, maintenances, ...vehicleData }: CreateVehicleInput) {
    const vehicle = await prisma.$transaction(async (tx) => {
      const created = await tx.vehicles.create({
        data: vehicleData,
      });
 
      if (documents && documents.length > 0) {
        await tx.vehicleDocuments.createMany({
          data: documents.map((doc) => ({
            ...doc,
            vehicle_id: created.id,
          })),
        });
      }
 
      if (maintenances && maintenances.length > 0) {
        await tx.vehicleMaintenance.createMany({
          data: maintenances.map((m) => ({
            ...m,
            vehicle_id: created.id,
          })),
        });
      }
 
      return tx.vehicles.findUnique({
        where: { id: created.id },
        include: {
          status: true,
          documents: true,
          maintenances: true,
        },
      });
    });
 
    return vehicle;
  }
 
  async getAllVehiclesByCompany(company_id: number, statusName?: string) {
    const vehicles = await prisma.vehicles.findMany({
      where: { 
        company_id,
        ...(statusName && {
          status: {
            name: {
              equals: statusName,
              mode: 'insensitive',
            },
          },
        }),
      },
      select: {
        id: true,
        plate: true,
        model: true,
        total_volume: true,
        company_id: true,
        status: {
          select: { name: true },
        },
        orders: {
          select: {
            products: {
              select: { volume: true },
            },
          },
        },
      },
    });
 
    return vehicles.map((vehicle) => {
      const usedVolume = vehicle.orders.reduce((acc, order) => {
        return acc + order.products.reduce((sum, p) => sum + (p.volume ?? 0), 0);
      }, 0);
 
      return {
        ...vehicle,
        available_volume: vehicle.total_volume - usedVolume,
      };
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
        documents: true,
        maintenances: true,
      },
    });
 
    return vehicle;
  }
 
  async deleteVehicle(id: number, company_id: number) {
    await prisma.vehicles.delete({
      where: {
        id,
        company_id,
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
