import { deleteUserService } from "@/services/deleteUser.js";
import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";



export async function deleteUser(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as {id: number};

  try {
    const users = await deleteUserService(id);
    return reply.status(200).send(users);
  } catch (error) {
    return reply.status(409).send(error);
  }  
}
