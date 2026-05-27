import { getAllPurchaseOrdersItemsService } from "@/services/purchaseOrders/purchaseOrdersItems/getAllPurchaseOrdersItems.js";
import { FastifyRequest, FastifyReply } from "fastify";

export async function getAllPurchaseOrdersItems(
  request: FastifyRequest,
  reply: FastifyReply
) {
  await request.jwtVerify();
  const company_id = Number(request.user.sub);

  if (request.user.role !== "company") return reply.status(403).send();

  try {
    const items = await getAllPurchaseOrdersItemsService(company_id);
    return reply.status(200).send(items);
  } catch (error) {
    console.error("Erro ao buscar itens:", error);
    return reply.status(500).send({ error: "Could not fetch purchase order items." });
  }
}