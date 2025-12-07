import { getInventoryByResourceIdService } from "@/services/inventory/iventoryGetByresourceId.js";
import { FastifyRequest, FastifyReply } from "fastify";

export async function getInventoryByResourceId(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { resourceId } = request.params as { resourceId: number };

  try {
    const list = await getInventoryByResourceIdService(resourceId);
    console.log(list);
    return reply.status(200).send(list);
  } catch (error) {
    return reply.status(500).send(error);
  }
}
