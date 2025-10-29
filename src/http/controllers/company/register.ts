import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { registerService } from "@/services/company/register.js";

export const companyRegisterBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  phone_number: z.string(),
  CNPJ: z.string(),
  password: z.string().min(6),
});

type RegisterBody = z.infer<typeof companyRegisterBodySchema>;

export async function register(
  request: FastifyRequest<{ Body: RegisterBody }>,
  reply: FastifyReply
) {
  const { name, email, password, phone_number, CNPJ } = request.body;

  try {
    await registerService({ name, CNPJ, email, password, phone_number });
  } catch (error) {
    return reply.status(409).send();
  }

  return reply.status(201).send(null);
}
