import { PrismaVehicleDocumentsRepository } from "@/repositories/prisma-vehicle-documents-repository.js";
 
interface CreateVehicleDocumentParams {
  vehicle_id: number;
  company_id: number;
  type: string;
  number?: string;
  issued_at?: Date;   
  expires_at?: Date;  
  file_url?: string;
  notes?: string;
}
 
export async function createVehicleDocumentService({
  vehicle_id,
  company_id,
  type,
  number,
  issued_at,
  expires_at,
  file_url,
  notes,
}: CreateVehicleDocumentParams) {
  const repository = new PrismaVehicleDocumentsRepository();
 
  const document = await repository.create({
  type,
  number,
  issued_at: issued_at ? new Date(issued_at) : undefined,
  expires_at: expires_at ? new Date(expires_at) : undefined,
  file_url,
  notes,
  vehicle: { connect: { id: vehicle_id } },
});
 
  return document;
}