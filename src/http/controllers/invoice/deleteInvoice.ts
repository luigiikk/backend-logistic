import { FastifyRequest, FastifyReply } from "fastify";
import { deleteInvoiceService } from "@/services/invoice/deleteInvoice.js";

export async function deleteInvoice(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as { id: number };

  try {
    const invoice = await deleteInvoiceService(id);
    return reply.status(200).send(invoice);
  } catch (error) {
    return reply.status(409).send(error);
  }
}
