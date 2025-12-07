import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { updateInvoiceService } from "@/services/invoice/updateInvoice.js";
import { updatePurchaseOrdersService } from "@/services/purchaseOrders/updatePurchaseOrder.js";
import { updatePurchaseOrdersItemsService } from "@/services/purchaseOrders/purchaseOrdersItems/updatePurchaseOrdersItems.js";

export const purchaseOrdersItemsUpdateBodySchema = z.object({
  purchase_order_id: z.number(),
  resource_id: z.number(),
  quantity: z.number(),
  unit_price: z.number(),
});

type RegisterBody = z.infer<typeof purchaseOrdersItemsUpdateBodySchema>;

export async function updatePurchaseOrderItems(
  request: FastifyRequest<{ Params: { id: number }; Body: RegisterBody }>,
  reply: FastifyReply
) {
  const {
    purchase_order_id,
    resource_id,
    quantity,
    unit_price
  } = request.body;

  const { id } = request.params;

  await request.jwtVerify();
    const company_id = request.user.sub;

    if (request.user.role != "company") {
      return reply.status(409).send();
    }

  try {
    await updatePurchaseOrdersItemsService(id, company_id, 
      purchase_order_id,
      resource_id,
      quantity,
      unit_price
    );
  } catch (error) {
    return reply.status(409).send();
  }

  return reply.status(200).send({ message: "Purchase order items updated successfully" });
}
