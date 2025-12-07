import { getAllInventoryService } from "@/services/inventory/getAllInventory.js";
import { getInventoryByResourceIdService } from "@/services/inventory/iventoryGetByresourceId.js";
import { FastifyRequest, FastifyReply } from "fastify";

export async function getAllInventory(
  request: FastifyRequest,
  reply: FastifyReply
) {

  await request.jwtVerify();
  const company_id = request.user.sub;

  if (request.user.role != "company") {
    return reply.status(409).send();
  }

  try {
    const inventory = await getAllInventoryService(company_id);

    return reply.status(200).send(inventory);
  } catch (error) {
    return reply.status(500).send(error);
  }
}
