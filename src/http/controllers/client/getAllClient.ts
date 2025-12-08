import { FastifyRequest, FastifyReply } from "fastify";
import { getAllClientsService } from "@/services/client/getAllClient.js";

export async function getAllClients(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    await request.jwtVerify();
    const company_id = request.user.sub;

    const clients = await getAllClientsService(company_id);
    
    return reply.status(200).send(clients);
  } catch (error) {
    return reply.status(500).send();
  }
}