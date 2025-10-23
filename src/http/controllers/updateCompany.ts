import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { updateCompanyService } from "@/services/updateCompany.js";

export const companyUpdateBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  phone_number: z.string(),
  cnpj: z.string(),
});

type RegisterBody = z.infer<typeof companyUpdateBodySchema>;

export async function updateCompany(
  request: FastifyRequest<{ Params: { id: number }, Body: RegisterBody }>,
  reply: FastifyReply
) {
  const { name,  email, phone_number, cnpj } = request.body;
  const { id } = request.params;

  try {
    await updateCompanyService(id, { name, email, phone_number, cnpj});
  } catch (error) {
    return reply.status(409).send();
  }

  return reply.status(200).send({ message: 'Company updated successfully' });
}
