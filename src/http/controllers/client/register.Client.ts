import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { registerClientService } from "@/services/client/registerClient.js";
import { addresRegisterBodySchema } from "@/http/controllers/addres/registerAddres.js";

export const clientRegisterBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(6),
  phone_number: z.string(),
  CNPJ: z.string(),
  addressData: addresRegisterBodySchema,
});

type RegisterBody = z.infer<typeof clientRegisterBodySchema>;

export async function registerClient(
  request: FastifyRequest<{ Body: RegisterBody }>,
  reply: FastifyReply
) {
  await request.jwtVerify();
  const company_id = request.user.sub;
  
  const { name, email, password, phone_number, CNPJ, addressData } = request.body;
  await registerClientService({ name, email, password, phone_number, CNPJ, company_id, addressData, });

  return reply.status(201).send(null);
}