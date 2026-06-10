import { FastifyRequest, FastifyReply } from "fastify";
import { getVehicleDocumentService } from "@/services/documents-vehicle/getDocumentById.js";

export async function getVehicleDocument(
  request: FastifyRequest<{ Params: { vehicle_id: number; id: number } }>,
  reply: FastifyReply
) {
  await request.jwtVerify();
  const company_id = request.user.sub;
  const { vehicle_id, id } = request.params;
 
  try {
    const document = await getVehicleDocumentService(
      id,
      vehicle_id,
      company_id
    );
 
    return reply.status(200).send(document);
  } catch (error) {
    return reply.status(404).send(error);
  }
}