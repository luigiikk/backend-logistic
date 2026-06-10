import { PrismaVehicleDocumentsRepository } from "@/repositories/prisma-vehicle-documents-repository.js";

export async function getVehicleDocumentService(
  id: number,
  vehicle_id: number,
  company_id: number
) {
  const repository = new PrismaVehicleDocumentsRepository();
 
  const document = await repository.getDocument(id, vehicle_id, company_id);
 
  if (!document) {
    throw new Error("Document not found");
  }
 
  return document;
}