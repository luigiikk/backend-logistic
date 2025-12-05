import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { updateClientService } from "@/services/client/updateCliente.js";

export const clientUpdateBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  phone_number: z.string(),
  CNPJ: z.string(),
  
  street: z.string().optional().nullable(),
  number: z.number().optional().nullable(), 
  complement: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  zipcode: z.string().optional().nullable(),
});

type RegisterBody = z.infer<typeof clientUpdateBodySchema>;

export async function updateClient(
  request: FastifyRequest<{ Params: { id: number }, Body: RegisterBody }>,
  reply: FastifyReply
) {
  const { name,  email, phone_number, CNPJ, street, number, complement, city, country, state, zipcode} = request.body;
  const { id } = request.params;

  try {
    await updateClientService(id, { name,  email, phone_number, CNPJ, street, number, complement, city, country, state, zipcode});
  } catch (error) {
    return reply.status(409).send();
  }

  return reply.status(200).send({ message: 'Client updated successfully' });
}
