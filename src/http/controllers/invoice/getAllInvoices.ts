import { FastifyRequest, FastifyReply } from "fastify";
import { getAllInvoicesService } from "@/services/invoice/getAllinvoice.js";

export async function getAllInvoices(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {

    await request.jwtVerify();
    const company_id = request.user.sub;

    if (request.user.role != "company") {
      return reply.status(409).send();
    }

    const invoices = await getAllInvoicesService(company_id);
    return reply.status(200).send(invoices);
  } catch (error) {
    return reply.status(500).send();
  }
}
