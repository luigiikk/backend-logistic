import { FastifyRequest, FastifyReply } from "fastify";
import { getClientService } from "@/services/Client/getClient.js";

export async function getClient(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: number };

  try {
    const client = await getClientService(id);
    return reply.status(200).send(client);
  } catch (error) {
    if (error instanceof Error) {
      return reply.status(409).send({ message: error.message });
    }
    return reply.status(409).send(error);
  }
}