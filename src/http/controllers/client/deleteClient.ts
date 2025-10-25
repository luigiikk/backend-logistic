import { FastifyRequest, FastifyReply } from "fastify";
import { deleteClientService } from "@/services/Client/deleteClient.js";

export async function deleteClient(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as { id: number };

  try {
    await deleteClientService(id);
    return reply.status(200).send({ message: "Client deleted successfully" });
  } catch (error) {
    if (error instanceof Error) {
      return reply.status(409).send({ message: error.message });
    }
    return reply.status(409).send(error);
  }
}