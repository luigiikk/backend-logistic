import { FastifyRequest, FastifyReply } from "fastify";
import { getOrderByCodeService } from "@/services/order/getOrderByCode.js";

export async function getOrderByCode(
  request: FastifyRequest,
  reply: FastifyReply
) {

  const { code } = request.params as { code: string };
  try {
    const order = await getOrderByCodeService({code});

    const response = {
      ...order,
      sender_client: { name: order.sender_client?.name || "" },
      recipient: { name: order.recipient?.name || "" },
      status: { name: order.status?.name || "" },
    };

    return reply.status(200).send(response);
  } catch (error) {
    return reply.status(409).send(error);
  }
}
