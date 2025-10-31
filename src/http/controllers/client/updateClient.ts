import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { updateClientService } from "@/services/client/updateCliente.js";

export const clientUpdateBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  phone_number: z.string(),
  CNPJ: z.string(),
  CPF: z.string(),
  addres_id: z.number().int(),
  client_roles: z.number().int(),
});

type RegisterBody = z.infer<typeof clientUpdateBodySchema>;

export async function updateClient(
  request: FastifyRequest<{ Params: { id: number }, Body: RegisterBody }>,
  reply: FastifyReply
) {
  const { name,  email, phone_number, CNPJ, CPF, addres_id, client_roles} = request.body;
  const { id } = request.params;

  try {
    await updateClientService(id, { name,  email, phone_number, CNPJ, CPF, addres_id, client_roles});
  } catch (error) {
    return reply.status(409).send();
  }

  return reply.status(200).send({ message: 'Client updated successfully' });
}
