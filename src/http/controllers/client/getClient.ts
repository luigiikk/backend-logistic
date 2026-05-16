import { FastifyRequest, FastifyReply } from "fastify";
import { getClientService } from "@/services/client/getClient.js";


export async function getClient(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as {id: number};
    await request.jwtVerify();
    const company_id = request.user.sub;

    const client = await getClientService(id, company_id);

    const response = {
      id: client.id,
      name: client.name,
      email: client.email,
      phone_number: client.phone_number,
      CNPJ: client.CNPJ ?? null,
      addres_id: client.addres_id,
    
      street: client.addres?.street ?? null,
      number: client.addres?.number ?? null,
      complement: client.addres?.complement ?? null,
      city: client.addres?.city ?? null,
      state: client.addres?.state ?? null,
      country: client.addres?.country ?? null,
      zipcode: client.addres?.zipcode ?? null,
    };
    
    return reply.status(200).send(response);
}
