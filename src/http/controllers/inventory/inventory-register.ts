import { registerInventoryService } from "@/services/inventory/inventoryRegister.js";
import { registerResourceService } from "@/services/resources/registerResource.js";
import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";

export const inventoryRegisterBodySchema = z.object({
  resource_id: z.number(),
  warehouse_id:  z.number(),
  quantity:   z.number(),
});

type RegisterBody = z.infer<typeof inventoryRegisterBodySchema>;

export async function inventoryRegister(
  request: FastifyRequest<{ Body: RegisterBody }>,
  reply: FastifyReply
) {

  
  await request.jwtVerify();
  const company_id = request.user.sub;

  if (request.user.role != "company") {
    return reply.status(409).send();
  }

  const { resource_id, warehouse_id, quantity } = request.body;

  try {
    await registerInventoryService(company_id, { resource_id, warehouse_id, quantity});
  } catch (error) {
    return reply.status(409).send();
  }

  return reply.status(201).send(null);
}
