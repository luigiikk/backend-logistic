import { FastifyRequest, FastifyReply } from "fastify";
import { getStatusService } from "@/services/status/getStatus.js";

export async function getStatus(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: number };

  try {
    const status = await getStatusService(id);
    return reply.status(200).send(status);
  } catch (error) {
    return reply.status(409).send(error);
  }
}
