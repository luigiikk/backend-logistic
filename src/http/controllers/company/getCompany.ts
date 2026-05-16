import { FastifyRequest, FastifyReply } from "fastify";
import { getCompanyService } from "@/services/company/getCompany.js";


export async function getCompany(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as {id: number};

  const company = await getCompanyService(id);
  const response = {
    name: company.name,
    email: company.email,
    phone_number: company.phone_number,
    cnpj: company.CNPJ,
  

    street: company.addres?.street,
    number: company.addres?.number,
    complement: company.addres?.complement,
    city: company.addres?.city,
    state: company.addres?.state,
    country: company.addres?.country,
    zipcode: company.addres?.zipcode,
  };


  return reply.status(200).send(response);
}
