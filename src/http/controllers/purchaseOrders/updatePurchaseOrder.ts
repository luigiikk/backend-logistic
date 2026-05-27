import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { updatePurchaseOrdersService } from "@/services/purchaseOrders/updatePurchaseOrder.js";

export const purchaseOrdersUpdateBodySchema = z.object({
  supplier_id: z.number(),
  status_id: z.number(),
  purchase_orders_items: z.array(
    z.object({
      resource_id: z.number().int(),
      warehouse_id: z.number(),
      quantity: z.number(),
      unit_price: z.number(),
  }))
});

type RegisterBody = z.infer<typeof purchaseOrdersUpdateBodySchema>;

export async function updatePurchaseOrder(
  request: FastifyRequest<{ Params: { id: number }; Body: RegisterBody }>,
  reply: FastifyReply
) {
  const {
    supplier_id,
    status_id,
    purchase_orders_items
  } = request.body;

  const { id } = request.params;

  await request.jwtVerify();
    const company_id = request.user.sub;

    if (request.user.role != "company") {
      return reply.status(409).send();
    }
    

  try {
    await updatePurchaseOrdersService(id, company_id, {
      supplier_id,
      status_id,
      purchase_orders_items
    } );
  } catch (error) {
    return reply.status(409).send();
  }

  return reply.status(200).send({ message: "Invoice updated successfully" });
}
