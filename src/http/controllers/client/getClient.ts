import { FastifyRequest, FastifyReply } from "fastify";
import { getClientService } from "@/services/client/getClient.js";


export async function getClient(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as {id: number};

  try {
    const client = await getClientService(id);

    const response = {
      name: client.name,
      email: client.email,
      phone_number: client.phone_number,
      CNPJ: client.CNPJ,
      addres_id: client.addres_id,
      CPF: client.CPF,
      client_roles: client.client_roles,

      street: client.addres?.street,
      number: client.addres?.number,
      complement: client.addres?.complement,
      city: client.addres?.city,
      state: client.addres?.state,
      country: client.addres?.country,
      zipcode: client.addres?.zipcode,
    }; 
    return reply.status(200).send(response);
  } catch (error) {
    return reply.status(409).send(error);
  }  
}
