import { getAllPurchaseOrdersService } from "@/services/purchaseOrders/getAllPurchaseOrders.js";
import { getPurchaseOrdersByIdService } from "@/services/purchaseOrders/getPurchaseOrdersById.js";
import { FastifyRequest, FastifyReply } from "fastify";

export async function getPurchaseOrdersById(
  request: FastifyRequest,
  reply: FastifyReply
) {

const { id } = request.params as { id: number };

  await request.jwtVerify();

  if (request.user.role != "company") {
    return reply.status(409).send();
  }

  const company_id = request.user.sub;

  try {
    const purchaseOrders = await getPurchaseOrdersByIdService(id, company_id);
    
    return reply.status(200).send(purchaseOrders);
  } catch (error) {
    console.log(error);
    return reply
      .status(409)
      .send({ error: "Could not found purchase orders." });
  }
}