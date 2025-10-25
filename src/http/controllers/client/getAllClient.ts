import { FastifyRequest, FastifyReply } from "fastify";
import { getAllClientsService } from "@/services/Client/getAllClient.js";

export async function getAllClients(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const clients = await getAllClientsService();
    return reply.status(200).send(clients);
  } catch (error) {
    return reply.status(500).send();
  }
}