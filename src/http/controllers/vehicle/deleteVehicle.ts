import { FastifyRequest, FastifyReply } from "fastify";
import { deleteVehicleService } from "@/services/vehicle/deleteVehicle.js";

export async function deleteVehicle(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as { id: number };

  try {
    const vechile = await deleteVehicleService(id);
    return reply.status(200).send(vechile);
  } catch (error) {
    return reply.status(409).send(error);
  }
}
