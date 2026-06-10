import { prisma } from "@/lib/prisma.js";
import { PrismaVehicleMaintenanceRepository } from "@/repositories/prisma-vehicle-maintenance-repository.js";
 
interface CreateVehicleMaintenanceParams {
  vehicle_id: number;
  company_id: number;
  type: string;
  description?: string;
  cost?: number;
  mileage?: number;
  performed_at?: Date;
  next_due_at?: Date;
  performed_by?: string;
}
 
export async function createVehicleMaintenanceService({
  vehicle_id,
  company_id,
  type,
  description,
  cost,
  mileage,
  performed_at,
  next_due_at,
  performed_by,
}: CreateVehicleMaintenanceParams) {
  const vehicle = await prisma.vehicles.findUnique({
    where: { id: vehicle_id, company_id },
  });
 
  if (!vehicle) {
    throw new Error("Vehicle not found");
  }
 
  const repository = new PrismaVehicleMaintenanceRepository();
 
  const maintenance = await repository.create({
    type,
    description,
    cost,
    mileage,
    performed_at,
    next_due_at,
    performed_by,
    vehicle: { connect: { id: vehicle_id } },
  });
 
  return maintenance;
}