import { prisma } from "@/lib/prisma.js";
import { Prisma } from "@prisma/client";

export interface UpdateVehicleMaintenanceParams {
  type?: string;
  description?: string;
  cost?: number;
  mileage?: number;
  performed_at?: Date;
  next_due_at?: Date;
  performed_by?: string;
}

export interface CreateMaintenanceInput {
  type: string;
  description?: string;
  cost?: number;
  mileage?: number;
  performed_at?: string;
  next_due_at?: string;
  performed_by?: string;
}

export interface ParsedMaintenanceInput {
  type: string;
  description?: string;
  cost?: number;
  mileage?: number;
  performed_at?: Date;
  next_due_at?: Date;
  performed_by?: string;
}

export class PrismaVehicleMaintenanceRepository {
  async create(data: Prisma.VehicleMaintenanceCreateInput) {
    const maintenance = await prisma.vehicleMaintenance.create({
      data,
    });

    return maintenance;
  }

  async getAllByVehicle(vehicle_id: number, company_id: number) {
    const maintenances = await prisma.vehicleMaintenance.findMany({
      where: {
        vehicle_id,
        vehicle: { company_id },
      },
      select: {
        id: true,
        type: true,
        description: true,
        cost: true,
        mileage: true,
        performed_at: true,
        next_due_at: true,
        performed_by: true,
        created_at: true,
      },
    });

    return maintenances;
  }

  async getMaintenance(id: number, vehicle_id: number, company_id: number) {
    const maintenance = await prisma.vehicleMaintenance.findFirst({
      where: {
        id,
        vehicle_id,
        vehicle: { company_id },
      },
    });

    return maintenance;
  }

  async updateMaintenance(
    id: number,
    vehicle_id: number,
    company_id: number,
    data: UpdateVehicleMaintenanceParams
  ) {
    const maintenanceExists = await prisma.vehicleMaintenance.findFirst({
      where: {
        id,
        vehicle_id,
        vehicle: { company_id },
      },
    });

    if (!maintenanceExists) {
      throw new Error("Maintenance not found");
    }

    const updated = await prisma.vehicleMaintenance.update({
      where: { id },
      data,
    });

    return updated;
  }

  async deleteMaintenance(id: number, vehicle_id: number, company_id: number) {
    const maintenanceExists = await prisma.vehicleMaintenance.findFirst({
      where: {
        id,
        vehicle_id,
        vehicle: { company_id },
      },
    });

    if (!maintenanceExists) {
      throw new Error("Maintenance not found");
    }

    await prisma.vehicleMaintenance.delete({
      where: { id },
    });
  }
}