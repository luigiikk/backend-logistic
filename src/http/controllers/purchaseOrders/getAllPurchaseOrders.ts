import { getAllPurchaseOrdersService } from "@/services/purchaseOrders/getAllPurchaseOrders.js";
import { purchaseOrdersService } from "@/services/purchaseOrders/purchaseOrders.js";
import { FastifyRequest, FastifyReply } from "fastify";

export async function getAllPurchaseOrders(
  request: FastifyRequest,
  reply: FastifyReply
) {

  await request.jwtVerify();

  if (request.user.role != "company") {
    return reply.status(409).send();
  }

  const company_id = request.user.sub;

  try {
    const purchaseOrders = await getAllPurchaseOrdersService(company_id);

    return reply.status(200).send(purchaseOrders);
  } catch (error) {
    console.log(error);
    return reply
      .status(409)
      .send({ error: "Could not found purchase orders." });
  }
}