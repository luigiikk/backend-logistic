import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { updateInvoiceService } from "@/services/invoice/updateInvoice.js";

export const invoiceUpdateBodySchema = z.object({
  issue_date: z.coerce.date(),
  due_date: z.coerce.date(),
  link_file: z.string(),
});

type RegisterBody = z.infer<typeof invoiceUpdateBodySchema>;

export async function updateInvoice(
  request: FastifyRequest<{ Params: { id: number }; Body: RegisterBody }>,
  reply: FastifyReply
) {
  const {
    issue_date,
    due_date,
    link_file,
  } = request.body;

  const { id } = request.params;

  await request.jwtVerify();
    const company_id = request.user.sub;

    if (request.user.role != "company") {
      return reply.status(409).send();
    }

  try {
    await updateInvoiceService(id, company_id, {
      issue_date,
      due_date,
      link_file,
    });
  } catch (error) {
    return reply.status(409).send();
  }

  return reply.status(200).send({ message: "Invoice updated successfully" });
}
