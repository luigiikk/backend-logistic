import { FastifyRequest, FastifyReply } from "fastify";
import { getOrderService } from "@/services/order/getOrder.js";

export async function getOrder(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: number };

  try {
    await request.jwtVerify();

    if (request.user.role != "company") {
      return reply.status(409).send();
    }

    const company_id = request.user.sub;

    const order = await getOrderService(id, company_id);


    const response = {
      code: order.code ?? "",
      sender_client: order.sender_client?.name,
      recipient: order.recipient.name,
      status: order.status.name,
      vehicle: order.vehicle?.plate,
    };
    
    return reply.status(200).send(response);
  } catch (error) {
    return reply.status(409).send(error);
  }
}
