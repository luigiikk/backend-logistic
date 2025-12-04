import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { updateCompanyService } from "@/services/company/updateCompany.js";
import { updateSupplierService } from "@/services/supplier/updateSupplier.js";

export const supplierUpdateBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  CNPJ: z.string(),
  contactPerson: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),

  street: z.string().optional().nullable(),
  number: z.number().optional().nullable(), 
  complement: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  zipcode: z.string().optional().nullable(),
});
type RegisterBody = z.infer<typeof supplierUpdateBodySchema>;

export async function updateSupplier(
  request: FastifyRequest<{ Params: { id: number }, Body: RegisterBody }>,
  reply: FastifyReply
) {
  await request.jwtVerify();
  const company_id = request.user.sub;
  
  const { name, email, CNPJ, contactPerson, phone, notes, street, number, complement, city, country, state, zipcode} = request.body;

  const { id } = request.params;

  try {
    await updateSupplierService(id, { name, email, phone, CNPJ, contactPerson, notes, company_id, street, number, complement, city, country, state, zipcode});
  } catch (error) {
    return reply.status(409).send();
  }

  return reply.status(200).send({ message: 'Company updated successfully' });
}
