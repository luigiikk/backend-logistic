import { FastifyRequest, FastifyReply } from "fastify";
import { deleteVehicleService } from "@/services/vehicle/deleteVehicle.js";

export async function deleteVehicle(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as { id: number };
    await request.jwtVerify();
    const company_id = request.user.sub;

  try {
    await deleteVehicleService(id, company_id);
    return reply.status(200).send();
  } catch (error) {
    return reply.status(409).send(error);
  }
}
