import { FastifyRequest, FastifyReply } from "fastify";
import { getAllUsersService } from "@/services/getAllCompanies.js";


export async function getAllCompanies(
  request: FastifyRequest,
  reply: FastifyReply
) {

  try {
    const users = await getAllCompaniesService();
    return reply.status(200).send(users);
  } catch (error) {
    return reply.status(409).send();
  }  
}
