import { dispatchInventoryService } from "@/services/inventory/inventoryDispatch.js";
import { registerInventoryService } from "@/services/inventory/inventoryRegister.js";
import { registerResourceService } from "@/services/resources/registerResource.js";
import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";

export const inventoryDispatchBodySchema = z.object({
  resource_id: z.number(),
  warehouse_id:  z.number(),
  quantity:   z.number(),
});

type RegisterBody = z.infer<typeof inventoryDispatchBodySchema>;

export async function InventoryDispatch(
  request: FastifyRequest<{ Body: RegisterBody }>,
  reply: FastifyReply
) {
  const { resource_id, warehouse_id, quantity } = request.body;

  try {
    await dispatchInventoryService({ resource_id, warehouse_id, quantity});
  } catch (error) {
    return reply.status(409).send();
  }

  return reply.status(201).send(null);
}
