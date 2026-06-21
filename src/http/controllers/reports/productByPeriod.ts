import { getProductsByPeriodService } from "@/services/reports/productByPeriod.js";
import { FastifyReply, FastifyRequest } from "fastify";

export async function getProductsByPeriod(
  request: FastifyRequest<{
    Querystring: { start_date: string; end_date: string };
  }>,
  reply: FastifyReply
) {
  await request.jwtVerify();
  const company_id = request.user.sub;
  const { start_date, end_date } = request.query;
 
  try {
    const result = await getProductsByPeriodService({
      company_id,
      start_date,
      end_date,
    });
    return reply.status(200).send(result);
  } catch (error) {
    return reply.status(400).send(error);
  }
}
