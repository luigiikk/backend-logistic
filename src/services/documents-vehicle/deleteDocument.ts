import { PrismaVehicleDocumentsRepository } from "@/repositories/prisma-vehicle-documents-repository.js";

export async function deleteVehicleDocumentService(
  id: number,
  vehicle_id: number,
  company_id: number
) {
  const repository = new PrismaVehicleDocumentsRepository();
 
  await repository.deleteDocument(id, vehicle_id, company_id);
}