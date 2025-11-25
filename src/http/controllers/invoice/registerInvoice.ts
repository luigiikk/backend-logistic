import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { registerInvoiceService } from "@/services/invoice/registerInvoice.js";

export const invoiceRegisterBodySchema = z.object({
  client_id: z.number().int(),
  recipient_id: z.number().int(),
  invoice_number: z.number().int(),
  issue_date: z.string().transform((s) => new Date(s)),
  due_date: z.string().transform((s) => new Date(s)),
  total_amount: z.number(),
  tax_amount: z.number(),
  status_id: z.number(),
  link_file: z.string(),
});

type RegisterBody = z.infer<typeof invoiceRegisterBodySchema>;

export async function registerInvoice(
  request: FastifyRequest<{ Body: RegisterBody }>,
  reply: FastifyReply
) {
  const {
    client_id,
    recipient_id,
    invoice_number,
    issue_date,
    due_date,
    total_amount,
    tax_amount,
    status_id,
    link_file,
  } = request.body;

  try {
    await registerInvoiceService({
      client_id,
      recipient_id,
      invoice_number,
      issue_date,
      due_date,
      total_amount,
      tax_amount,
      status_id,
      link_file,
    });
  } catch (error) {
    return reply.status(409).send();
  }

  return reply.status(201).send(null);
}
