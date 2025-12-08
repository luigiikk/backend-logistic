import { FastifyRequest, FastifyReply } from "fastify";
import { deleteOrderService } from "@/services/order/deleteOrder.js";

export async function deleteOrder(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as { id: number };

  try {
    const order = await deleteOrderService(id);
    return reply.status(200).send(order);
  } catch (error) {
    return reply.status(409).send(error);
  }
}
