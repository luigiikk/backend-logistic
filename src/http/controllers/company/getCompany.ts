import { FastifyRequest, FastifyReply } from "fastify";
import { getCompanyService } from "@/services/company/getCompany.js";


export async function getCompany(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as {id: number};

  try {
    const company = await getCompanyService(id);

    const response = {
      name: company.name,
      email: company.email,
      phone_number: company.phone_number,
      cnpj: company.CNPJ, 
    }; 
    return reply.status(200).send(response);
  } catch (error) {
    return reply.status(409).send(error);
  }  
}
