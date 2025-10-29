import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { registerService } from "@/services/company/register.js";
import { authCompanyService } from "@/services/company/authCompany.js";

export const companyAuthBodySchema = z.object({
  CNPJ: z.string(),
  password: z.string().min(6),
});

type RegisterBody = z.infer<typeof companyAuthBodySchema>;

export async function authCompany(
  request: FastifyRequest<{ Body: RegisterBody }>,
  reply: FastifyReply
) {
  const { CNPJ, password } = request.body;

  try {
    await authCompanyService({ CNPJ, password });
  } catch (error) {
    return reply.status(409).send();
  }

  return reply.status(201).send(null);
}
