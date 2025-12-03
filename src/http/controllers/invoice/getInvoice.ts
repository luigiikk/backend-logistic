import { FastifyRequest, FastifyReply } from "fastify";
import { getInvoiceService } from "@/services/invoice/getInvoice.js";

export async function getInvoice(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: number };

  try {
    const invoice = await getInvoiceService(id);
    return reply.status(200).send(invoice);
  } catch (error) {
    return reply.status(409).send(error);
  }
}
