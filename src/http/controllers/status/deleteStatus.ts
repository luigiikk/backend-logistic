import { FastifyRequest, FastifyReply } from "fastify";
import { deleteStatusService } from "@/services/status/deleteStatus.js";

export async function deleteStatus(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as { id: number };

  try {
    const status = await deleteStatusService(id);
    return reply.status(200).send(status);
  } catch (error) {
    return reply.status(409).send(error);
  }
}
