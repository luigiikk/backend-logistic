import { getPurchaseOrdersByIdService } from "@/services/purchaseOrders/getPurchaseOrdersById.js";
import { getPurchaseOrdersItemsByIdService } from "@/services/purchaseOrders/purchaseOrdersItems/getPurchaseOrdersItemsById.js";
import { FastifyRequest, FastifyReply } from "fastify";

export async function getPurchaseOrdersItemsById(
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
    const purchaseOrdersItem = await getPurchaseOrdersItemsByIdService(id, company_id);
    return reply.status(200).send(purchaseOrdersItem);
  } catch (error) {
    console.log(error);
    return reply
      .status(409)
      .send({ error: "Could not found purchase orders." });
  }
}