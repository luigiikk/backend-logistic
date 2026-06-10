import { getProductsByMonthService } from "@/services/reports/productByMonth.js";
import { FastifyReply, FastifyRequest } from "fastify";

export async function getProductsByMonth(
  request: FastifyRequest<{
    Querystring: { year: number; month: number };
  }>,
  reply: FastifyReply
) {
  await request.jwtVerify();
  const company_id = request.user.sub;
  const { year, month } = request.query;
 
  try {
    const result = await getProductsByMonthService({ company_id, year, month });
    return reply.status(200).send(result);
  } catch (error) {
    return reply.status(400).send(error);
  }
}