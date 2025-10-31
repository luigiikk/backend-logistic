import { FastifyRequest, FastifyReply } from "fastify";
import { getAllOrdersService } from "@/services/order/getAllOrders.js";

export async function getAllOrders(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const orders = await getAllOrdersService();
    return reply.status(200).send(orders);
  } catch (error) {
    return reply.status(500).send();
  }
}
