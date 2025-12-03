import { FastifyRequest, FastifyReply } from "fastify";
import { getAllInvoicesService } from "@/services/invoice/getAllinvoice.js";

export async function getAllInvoices(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const invoices = await getAllInvoicesService();
    return reply.status(200).send(invoices);
  } catch (error) {
    return reply.status(500).send();
  }
}
