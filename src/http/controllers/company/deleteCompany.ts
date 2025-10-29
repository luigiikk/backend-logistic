import { deleteCompanyService } from "@/services/company/deleteCompany.js";
import { FastifyRequest, FastifyReply } from "fastify";




export async function deleteCompany(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as {id: number};

  try {
    const companies = await deleteCompanyService(id);
    return reply.status(200).send(companies);
  } catch (error) {
    return reply.status(409).send(error);
  }  
}
