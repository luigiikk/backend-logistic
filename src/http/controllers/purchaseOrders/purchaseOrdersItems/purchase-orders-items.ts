import { purchaseOrdersService } from "@/services/purchaseOrders/purchaseOrders.js";
import { purchaseOrdersItemsService } from "@/services/purchaseOrders/purchaseOrdersItems/purchaseOrdersItems.js";
import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";

export const purchaseOrdersItemsBodySchema = z.object({
  resource_id: z.number(),
  quantity: z.number(),
  unit_price: z.number(),
});

type RegisterBody = z.infer<typeof purchaseOrdersItemsBodySchema>;

export async function purchaseOrdersItems(
  request: FastifyRequest<{ Body: RegisterBody }>,
  reply: FastifyReply
) {
  const { purchaseOrdersId } = request.params as { purchaseOrdersId: number };

  const { resource_id, quantity,  unit_price} = request.body;

  try {
    const purchaseOrderItems = await purchaseOrdersItemsService({
      resource_id,
      quantity,
      unit_price,
      purchaseOrdersId
    });

    return reply.status(201).send(purchaseOrderItems);
  } catch (error) {
    console.log(error);
    return reply.status(409).send({ error: "Could not create purchase order." });
  }
}