import { FastifyRequest, FastifyReply } from "fastify";
import { getInvoiceService } from "@/services/invoice/getInvoice.js";

export async function getInvoice(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: number };

    await request.jwtVerify();
    const company_id = request.user.sub;

    if (request.user.role != "company") {
      return reply.status(409).send();
    }

  try {
    const invoice = await getInvoiceService(id, company_id);
    return reply.status(200).send(invoice);
  } catch (error) {
    return reply.status(409).send(error);
  }
}
