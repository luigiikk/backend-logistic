import { FastifyRequest, FastifyReply } from "fastify";
import { deleteClientService } from "@/services/client/deleteClient.js";

export async function deleteClient(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as { id: number };

  try {
    const client = await deleteClientService(id);
    return reply.status(200).send(client);
  } catch (error){
    return reply.status(409).send(error);
  }
}