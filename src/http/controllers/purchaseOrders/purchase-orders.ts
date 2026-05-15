import { purchaseOrdersService } from "@/services/purchaseOrders/purchaseOrders.js";
import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";

export const purchaseOrdersBodySchema = z.object({
  supplier_id: z.number(),
  status_id: z.number().optional(),
  purchase_orders_items: z.array(
    z.object({
      resource_id: z.number(),
      warehouse_id: z.number(),
      quantity: z.number(),
      unit_price: z.number(),
  }))
});

type RegisterBody = z.infer<typeof purchaseOrdersBodySchema>;

export async function purchaseOrders(
  request: FastifyRequest<{ Body: RegisterBody }>,
  reply: FastifyReply
) {
  const { supplier_id, status_id, purchase_orders_items } = request.body;

  await request.jwtVerify();

  if (request.user.role != "company") {
    return reply.status(409).send();
  }

  const company_id = request.user.sub;

  try {
    const purchaseOrder = await purchaseOrdersService(company_id, {
      supplier_id,
      status_id,
      purchase_orders_items,
    });

    return reply.status(201).send(null);
  } catch (error) {
    console.log(error);
    return reply
      .status(409)
      .send({ error: "Could not create purchase order." });
  }
}