import { FastifyRequest, FastifyReply } from "fastify";
import { getUserService } from "@/services/getUser.js";


export async function getUser(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as {id: number};

  try {
    const user = await getUserService(id);
    return reply.status(200).send(user);
  } catch (error) {
    return reply.status(409).send(error);
  }  
}
