import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { registerService } from "@/services/company/register.js";

export const companyRegisterBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  phone_number: z.string(),
  CNPJ: z.string(),
  password: z.string().min(6),
  street: z.string().nullable().optional(),
  number: z.number().nullable().optional(),
  complement: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  zipcode: z.string().nullable().optional(),
});

type RegisterBody = z.infer<typeof companyRegisterBodySchema>;

export async function registerCompany(
  request: FastifyRequest<{ Body: RegisterBody }>,
  reply: FastifyReply
) {
  const { name, email, password, phone_number, CNPJ, number, street, complement, city, country, state, zipcode } = request.body;

  try {
    await registerService({ name, CNPJ, email, password, phone_number, number, street, complement, city, country, state, zipcode });
  } catch (error) {
    return reply.status(409).send();
  }

  return reply.status(201).send(null);
}
