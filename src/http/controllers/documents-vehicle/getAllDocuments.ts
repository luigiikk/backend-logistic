import { getAllVehicleDocumentsService } from "@/services/documents-vehicle/getAllDocuments.js";
import { FastifyRequest, FastifyReply } from "fastify";

export async function getAllVehicleDocuments(
  request: FastifyRequest<{ Params: { vehicle_id: number } }>,
  reply: FastifyReply
) {
  await request.jwtVerify();
  const company_id = request.user.sub;
  const { vehicle_id } = request.params;
 
  try {
    const documents = await getAllVehicleDocumentsService(
      vehicle_id,
      company_id
    );
 
    return reply.status(200).send(documents);
  } catch (error) {
    return reply.status(400).send(error);
  }
}