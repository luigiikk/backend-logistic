import { FastifyRequest, FastifyReply } from "fastify";
import { getCompanyService } from "@/services/company/getCompany.js";


export async function getCompany(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as {id: number};

  try {
    const company = await getCompanyService(id);
    return reply.status(200).send(company);
  } catch (error) {
    return reply.status(409).send(error);
  }  
}
