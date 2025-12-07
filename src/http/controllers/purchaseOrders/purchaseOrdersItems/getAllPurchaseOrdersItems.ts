import { getAllPurchaseOrdersService } from "@/services/purchaseOrders/getAllPurchaseOrders.js";
import { getAllPurchaseOrdersItemsService } from "@/services/purchaseOrders/purchaseOrdersItems/getAllPurchaseOrdersItems.js";
import { FastifyRequest, FastifyReply } from "fastify";

export async function getAllPurchaseOrdersItems(
  request: FastifyRequest,
  reply: FastifyReply
) {

  await request.jwtVerify();

  if (request.user.role != "company") {
    return reply.status(409).send();
  }

  const company_id = request.user.sub;

  try {
    const purchaseOrdersItems = await getAllPurchaseOrdersItemsService(company_id);

    console.log(purchaseOrdersItems)
    return reply.status(200).send(purchaseOrdersItems);
  } catch (error) {
    console.log(error);
    return reply
      .status(409)
      .send({ error: "Could not found purchase orders." });
  }
}