import { FastifyRequest, FastifyReply } from "fastify";
import { getAllSupplierByCompanyService } from "@/services/supplier/getAllSupplieByCompany.js";


export async function getAllSupplierByCompany(
  request: FastifyRequest,
  reply: FastifyReply
) {
  await request.jwtVerify();
  const company_id = request.user.sub;

  console.log(company_id);

  try {
   const supplier =  await getAllSupplierByCompanyService(company_id);

   return reply.status(200).send(supplier);
  } catch (error) {
    return reply.status(409).send();
  }  
}
