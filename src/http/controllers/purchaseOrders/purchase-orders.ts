import { purchaseOrdersService } from "@/services/purchaseOrders/purchaseOrders.js";
import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";

export const purchaseOrdersBodySchema = z.object({
  supplier_id: z.number(),
  status_id: z.number()
});

type RegisterBody = z.infer<typeof purchaseOrdersBodySchema>;

export async function purchaseOrders(
  request: FastifyRequest<{ Body: RegisterBody }>,
  reply: FastifyReply
) {
  const { supplier_id, status_id } = request.body;

  try {
    const purchaseOrder = await purchaseOrdersService({
      supplier_id,
      status_id,
    });

    return reply.status(201).send(purchaseOrder);
  } catch (error) {
    console.log(error);
    return reply.status(409).send({ error: "Could not create purchase order." });
  }
}