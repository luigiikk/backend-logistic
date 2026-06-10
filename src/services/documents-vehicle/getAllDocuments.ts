import { PrismaVehicleDocumentsRepository } from "@/repositories/prisma-vehicle-documents-repository.js";

export async function getAllVehicleDocumentsService(
  vehicle_id: number,
  company_id: number
) {
  const repository = new PrismaVehicleDocumentsRepository();
 
  const documents = await repository.getAllByVehicle(vehicle_id, company_id);
 
  return documents;
}