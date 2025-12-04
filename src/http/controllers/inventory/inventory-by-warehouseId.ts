import { getInventoryByWarehouseIdService } from "@/services/inventory/inventoryGetByWarehouseId.js";
import { FastifyRequest, FastifyReply } from "fastify";

export async function getInventoryByWarehouseId(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { warehouseId } = request.params as { warehouseId: number };

  try {
    const list = await getInventoryByWarehouseIdService(warehouseId);
    return reply.status(200).send(list);
  } catch (error) {
    return reply.status(500).send(error);
  }
}