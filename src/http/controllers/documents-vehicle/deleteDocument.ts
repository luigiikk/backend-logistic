import { deleteVehicleDocumentService } from "@/services/documents-vehicle/deleteDocument.js";
import { FastifyRequest, FastifyReply } from "fastify";

export async function deleteVehicleDocument(
  request: FastifyRequest<{ Params: { vehicle_id: number; id: number } }>,
  reply: FastifyReply
) {
  await request.jwtVerify();
  const company_id = request.user.sub;
  const { vehicle_id, id } = request.params;
 
  try {
    await deleteVehicleDocumentService(id, vehicle_id, company_id);
 
    return reply.status(200).send("Document deleted");
  } catch (error) {
    return reply.status(404).send(error);
  }
}