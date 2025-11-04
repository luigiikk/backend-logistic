import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { registerClientService } from "@/services/client/registerClient.js";

export const clientRegisterBodySchema = z.object({

  name: z.string(),
  email: z.email(),
  password: z.string().min(6),
   CPF: z.string(),
  phone_number: z.string(),
  CNPJ: z.string(),
  addres_id: z.number().int(),
  client_roles: z.number().int(),
});

type RegisterBody = z.infer<typeof clientRegisterBodySchema>;

export async function registerClient(
  request: FastifyRequest<{ Body: RegisterBody }>,
  reply: FastifyReply
) {
  const { name, email, password, CPF, phone_number, CNPJ, addres_id, client_roles } = request.body;

  try {
    await registerClientService({ name, email, password, CPF, phone_number, CNPJ, addres_id, client_roles });
  } catch (error) {
    return reply.status(409).send();
  }

  return reply.status(201).send(null);
}