import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { registerService } from "@/services/register.js";

export const userRegisterBodySchema = z.object({
  enrollment: z.string(),
  name: z.string(),
  email: z.email(),
  phone_number: z.string(),
  password: z.string().min(6),
});

type RegisterBody = z.infer<typeof userRegisterBodySchema>;

export async function register(
  request: FastifyRequest<{ Body: RegisterBody }>,
  reply: FastifyReply
) {
  const { name, enrollment, email, password, phone_number } = request.body;

  try {
    await registerService({ name, enrollment, email, password, phone_number });
  } catch (error) {
    return reply.status(409).send();
  }

  return reply.status(201).send(null);
}
