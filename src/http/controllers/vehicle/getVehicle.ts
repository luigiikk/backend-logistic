import { FastifyRequest, FastifyReply } from "fastify";
import { getVehicleService } from "@/services/vehicle/getVehicle.js";

export async function getVehicle(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: number };

  try {
    const vehicle = await getVehicleService(id);
    return reply.status(200).send(vehicle);
  } catch (error) {
    return reply.status(409).send(error);
  }
}
