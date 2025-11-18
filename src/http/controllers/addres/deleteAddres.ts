import { deleteAddresService } from "@/services/addres/deleteAddres.js";
import { FastifyRequest, FastifyReply } from "fastify";

export async function deleteAddres(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as {id: number};

  try {
    const addres = await deleteAddresService(id);
    return reply.status(200).send(addres);
  } catch (error) {
    return reply.status(409).send(error);
  }  
}
