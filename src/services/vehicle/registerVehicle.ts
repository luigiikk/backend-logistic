import { prisma } from "@/lib/prisma.js";
import { PrismaVehiclesRepository } from "@/repositories/prisma-vehicle-repository.js";
import { PrismaStatusRepository } from "@/repositories/prisma-status-repository.js";
import { CreateDocumentInput } from "@/repositories/prisma-vehicle-documents-repository.js";
import { CreateMaintenanceInput } from "@/repositories/prisma-vehicle-maintenance-repository.js";

interface VehicleRegisterParams {
  plate: string;
  model: string;
  total_volume: number;
  status_id?: number;
  company_id: number;
  documents?: CreateDocumentInput[];
  maintenances?: CreateMaintenanceInput[];
}

export async function registerVehicleService({
  plate,
  model,
  total_volume,
  status_id,
  company_id,
  documents,
  maintenances,
}: VehicleRegisterParams) {
  const vehicleWithSamePlate = await prisma.vehicles.findUnique({
    where: { plate },
  });

  if (vehicleWithSamePlate) {
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

  const parsedDocuments = documents?.map((doc) => ({
    ...doc,
    issued_at: doc.issued_at ? new Date(doc.issued_at) : undefined,
    expires_at: doc.expires_at ? new Date(doc.expires_at) : undefined,
  }));

  const parsedMaintenances = maintenances?.map((m) => ({
    ...m,
    performed_at: m.performed_at ? new Date(m.performed_at) : undefined,
    next_due_at: m.next_due_at ? new Date(m.next_due_at) : undefined,
  }));

  const prismaVehiclesRepository = new PrismaVehiclesRepository();

  const vehicle = await prismaVehiclesRepository.create({
    plate,
    model,
    total_volume,
    status: { connect: { id: resolvedStatusId } },
    company: { connect: { id: company_id } },
    documents: parsedDocuments,
    maintenances: parsedMaintenances,
  });

  return vehicle;
}