import { getPurchaseOrdersItemsByIdService } from "@/services/purchaseOrders/purchaseOrdersItems/getPurchaseOrdersItemsById.js";
import { FastifyRequest, FastifyReply } from "fastify";

export async function getPurchaseOrdersItemsById(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  await request.jwtVerify();
  const company_id = Number(request.user.sub);

  if (request.user.role !== "company") return reply.status(409).send();

  const id = Number(request.params.id);

  try {
    const item = await getPurchaseOrdersItemsByIdService(id, company_id);
    return reply.status(200).send(item);
  } catch (error) {
    console.error("Erro ao buscar item:", error);
    return reply.status(500).send({ error: "Could not fetch purchase order item." });
  }
}