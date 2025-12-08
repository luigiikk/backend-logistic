import { FastifyRequest, FastifyReply } from "fastify";
import { getAllSupplierByCompanyService } from "@/services/supplier/getAllSupplieByCompany.js";

export async function getAllSupplierByCompany(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    await request.jwtVerify();
    const company_id = Number(request.user.sub);
    const rawData = await getAllSupplierByCompanyService(company_id);

    const formattedData = rawData.map((item: any) => ({
      ...item,
      address: item.addres ? item.addres : null,
      addres: undefined 
    }));

    return reply.status(200).send(formattedData);

  } catch (error) {
    return reply.status(500).send({ message: "Erro no servidor" });
  }  
}