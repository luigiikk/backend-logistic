import { FastifyRequest, FastifyReply } from "fastify";
import { getAllRolesService } from "@/services/role/getAllRole.js";


export async function getAllRoles(
  request: FastifyRequest,
  reply: FastifyReply
) {

  try {
    const roles = await getAllRolesService();
    return reply.status(200).send(roles);
  } catch (error) {
    return reply.status(409).send();
  }  
}
