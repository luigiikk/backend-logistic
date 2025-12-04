import { FastifyRequest, FastifyReply } from "fastify";
import { getOrderByCodeService } from "@/services/order/getOrderByCode.js";

export async function getOrderByCode(
  request: FastifyRequest,
  reply: FastifyReply
) {

  const { code } = request.params as { code: string };
  try {
    const order = await getOrderByCodeService({code});
    return reply.status(200).send(order);
  } catch (error) {
    return reply.status(409).send(error);
  }
}
