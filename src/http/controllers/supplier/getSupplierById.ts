import { FastifyRequest, FastifyReply } from "fastify";
import { getSupplierByIdService } from "@/services/supplier/getSupplierById.js";


export async function getSupplierById(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as {id: number};
  await request.jwtVerify();
  const company_id = request.user.sub;

  try {
    
    const supplier = await getSupplierByIdService(id, company_id);

    const response = {
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      CNPJ: supplier.CNPJ,
      contactPerson: supplier.contactPerson,
      notes: supplier.notes,
      address: {
        street: supplier.addres?.street ?? null,
        number: supplier.addres?.number ?? null,
        complement: supplier.addres?.complement ?? null,
        city: supplier.addres?.city ?? null,
        state: supplier.addres?.state ?? null,
        zipcode: supplier.addres?.zipcode ?? null,
      },
    };
    return reply.status(200).send(response);
  } catch (error) {
    return reply.status(409).send(error);
  }  
}
