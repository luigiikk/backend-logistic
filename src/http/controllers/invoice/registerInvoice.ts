import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { registerInvoiceService } from "@/services/invoice/registerInvoice.js";

export const invoiceRegisterBodySchema = z.object({
  company_id: z.number().int(),
  purchase_order_id: z.number().int(),
  issue_date: z.coerce.date(), 
  due_date: z.coerce.date(),  
  link_file: z.string(),
});

type RegisterBody = z.infer<typeof invoiceRegisterBodySchema>;

export async function registerInvoice(
  request: FastifyRequest<{ Body: RegisterBody }>,
  reply: FastifyReply
) {
  const {
    company_id,
    purchase_order_id,
    issue_date,
    due_date,
    link_file,
  } = request.body;

  try {
    await registerInvoiceService({
      company_id,        
      purchase_order_id, 
      issue_date,
      due_date,
      link_file,
    });
  } catch (error) {
    // Dica: Logue o erro aqui para saber o que aconteceu (console.error(error))
    return reply.status(409).send(); 
  }

  return reply.status(201).send(null);
}
