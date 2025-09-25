import { FastifyRequest, FastifyReply } from "fastify";
import { getAllUsersService } from "@/services/getAllUsers.js";


export async function getAllUsers(
  request: FastifyRequest,
  reply: FastifyReply
) {

  try {
    const users = await getAllUsersService();
    console.log(users);
    return reply.status(200).send(users);
  } catch (error) {
    return reply.status(409).send();
  }  
}
