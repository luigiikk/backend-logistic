import { FastifyRequest, FastifyReply } from "fastify";
import { getOrderByCpfService } from "@/services/order/getOrderByCpfService.js";


export async function getOrderByRecepientCpf(
  request: FastifyRequest<{ Querystring: { cpf: string } }>,
  reply: FastifyReply
) {
  const { cpf } = request.query;

  const order = await getOrderByCpfService( cpf );

  return reply.status(200).send(order);
}
