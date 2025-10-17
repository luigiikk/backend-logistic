import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { registerService } from "@/services/register.js";
import { updateUserService } from "@/services/updateUser.js";

export const userUpdateBodySchema = z.object({
  enrollment: z.string(),
  name: z.string(),
  email: z.email(),
  phone_number: z.string(),
});

type RegisterBody = z.infer<typeof userUpdateBodySchema>;

export async function updateUser(
  request: FastifyRequest<{ Params: { id: number }, Body: RegisterBody }>,
  reply: FastifyReply
) {
  const { name, enrollment, email, phone_number } = request.body;
  const { id } = request.params;

  try {
    await updateUserService(id, { name, enrollment, email, phone_number });
  } catch (error) {
    return reply.status(409).send();
  }

  return reply.status(200).send({ message: 'User updated successfully' });
}
