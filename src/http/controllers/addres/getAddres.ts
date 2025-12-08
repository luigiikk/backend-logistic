import { FastifyRequest, FastifyReply } from "fastify";
import { getAddresService } from "@/services/addres/getAddres.js";

export async function getAddres(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as {id: number};

  try {
    await request.jwtVerify();

    if(request.user.role != "company"){
      return reply.status(409).send();
    }

    const addres = await getAddresService(id);

    const response = {
      country: addres.country,
      state: addres.state,
      city: addres.city,
      street: addres.street,
      number: addres.number,
      zipcode: addres.zipcode,
      complement: addres.complement
    }; 
    return reply.status(200).send(response);
  } catch (error) {
    return reply.status(409).send(error);
  }  
}
