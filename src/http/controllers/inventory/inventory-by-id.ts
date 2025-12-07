import { getInventoryByIdService } from "@/services/inventory/iventoryGetById.js";
import { FastifyRequest, FastifyReply } from "fastify";

export async function getInventoryById(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as { id: number };
  await request.jwtVerify();
  const company_id = request.user.sub;

  if (request.user.role != "company") {
    return reply.status(409).send();
  }

  try {
    const inventory = await getInventoryByIdService(company_id, id);
    
    return reply.status(200).send(inventory);
  } catch (error) {
    return reply.status(500).send(error);
  }
}
