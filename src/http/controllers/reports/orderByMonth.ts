import { getOrdersByMonthService } from "@/services/reports/orderByMonth.js";
import { FastifyRequest, FastifyReply } from "fastify";
 
export async function getOrdersByMonth(
  request: FastifyRequest<{
    Querystring: { year: number; month: number };
  }>,
  reply: FastifyReply
) {
  await request.jwtVerify();
  const company_id = request.user.sub;
  const { year, month } = request.query;
 
  try {
    const result = await getOrdersByMonthService({ company_id, year, month });
    return reply.status(200).send(result);
  } catch (error) {
    return reply.status(400).send(error);
  }
}