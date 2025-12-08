import { registerInventoryService } from "@/services/inventory/inventoryRegister.js";
import { transferInventoryService } from "@/services/inventory/inventoryTransfer.js";
import { registerResourceService } from "@/services/resources/registerResource.js";
import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";

export const inventoryTransferBodySchema = z.object({
  id: z.number(),
  warehouse_id: z.number(),
  company_id: z.number(),
  quantity: z.number()
});

type RegisterBody = z.infer<typeof inventoryTransferBodySchema>;

export async function inventoryTransfer(
  request: FastifyRequest<{ Body: RegisterBody }>,
  reply: FastifyReply
) {
  await request.jwtVerify();
  const company_id = request.user.sub;

  if (request.user.role != "company") {
    return reply.status(409).send();
  }
  
  const { id, warehouse_id, quantity } = request.body;

  try {
    await transferInventoryService(company_id, { id, warehouse_id, quantity});
  } catch (error) {
    return reply.status(409).send();
  }

  return reply.status(201).send(null);
}
