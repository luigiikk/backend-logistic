import { FastifyRequest, FastifyReply } from "fastify";
import { getAllAddresService } from "@/services/addres/getAllAddres.js";


export async function getAllAddres(
  request: FastifyRequest,
  reply: FastifyReply
) {

  try {
    const addres = await getAllAddresService();
    return reply.status(200).send(addres);
  } catch (error) {
    return reply.status(409).send();
  }  
}
