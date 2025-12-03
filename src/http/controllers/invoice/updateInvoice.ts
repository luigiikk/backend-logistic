import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { updateInvoiceService } from "@/services/invoice/updateInvoice.js";

export const invoiceUpdateBodySchema = z.object({
  client_id: z.number().int(),
  recipient_id: z.number().int(),
  issue_date: z.string().transform((s) => new Date(s)),
  due_date: z.string().transform((s) => new Date(s)),
  total_amount: z.number(),
  tax_amount: z.number(),
  status_id: z.number(),
  link_file: z.string(),
});

type RegisterBody = z.infer<typeof invoiceUpdateBodySchema>;

export async function updateInvoice(
  request: FastifyRequest<{ Params: { id: number }; Body: RegisterBody }>,
  reply: FastifyReply
) {
  const {
    client_id,
    recipient_id,
    issue_date,
    due_date,
    total_amount,
    tax_amount,
    status_id,
    link_file,
  } = request.body;
  const { id } = request.params;

  try {
    await updateInvoiceService(id, {
      client_id,
      recipient_id,
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

  return reply.status(200).send({ message: "Invoice updated successfully" });
}
