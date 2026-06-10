import { PrismaVehicleDocumentsRepository } from "@/repositories/prisma-vehicle-documents-repository.js";

export interface UpdateVehicleDocumentParams {
  type?: string;
  number?: string;
  issued_at?: Date;
  expires_at?: Date;
  file_url?: string;
  notes?: string;
}
 
export async function updateVehicleDocumentService(
  id: number,
  vehicle_id: number,
  company_id: number,
  data: UpdateVehicleDocumentParams
) {
  const repository = new PrismaVehicleDocumentsRepository();
 
  const updated = await repository.updateDocument(
    id,
    vehicle_id,
    company_id,
    data
  );
 
  return updated;
}