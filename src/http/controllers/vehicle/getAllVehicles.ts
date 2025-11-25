import { FastifyRequest, FastifyReply } from "fastify";
import { getAllVehiclesService } from "@/services/vehicle/getAllVehicles.js";

export async function getAllVehicles(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const vehicle = await getAllVehiclesService();
    return reply.status(200).send(vehicle);
  } catch (error) {
    return reply.status(500).send();
  }
}
