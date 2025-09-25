import { deleteUserService } from "@/services/deleteUser.js";
import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";


export const userDeleteBodySchema = z.object({
  enrollment: z.string(),
});

type DeleteBody = z.infer<typeof userDeleteBodySchema>;

export async function deleteUser(
  request: FastifyRequest<{ Body: DeleteBody }>,
  reply: FastifyReply
) {

  const {enrollment} = request.body;

  try {
    const users = await deleteUserService(enrollment);
    return reply.status(200).send(users);
  } catch (error) {
    return reply.status(409).send(error);
  }  
}
