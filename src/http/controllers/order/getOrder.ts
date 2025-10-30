import { FastifyRequest, FastifyReply } from "fastify";
import { getOrderService } from "@/services/order/getOrder.js";

export async function getOrder(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: number };

  try {
    const order = await getOrderService(id);
    return reply.status(200).send(order);
  } catch (error) {
    return reply.status(409).send(error);
  }
}
