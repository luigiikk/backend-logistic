import { FastifyRequest, FastifyReply } from "fastify";
import { getInvoiceService } from "@/services/invoice/getInvoice.js";
import { prisma } from "@/lib/prisma.js";

export async function getInvoice(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: number };

    await request.jwtVerify();
    let company_id = request.user.sub;

    if (request.user.role !== "company") {
      const employee = await prisma.employees.findUnique({
        where: { id: Number(request.user.sub) },
      });
      if (!employee) {
        return reply.status(409).send();
      }
      company_id = employee.company_id;
    }

  try {
    const invoice = await getInvoiceService(id, company_id);
    return reply.status(200).send(invoice);
  } catch (error) {
    return reply.status(409).send(error);
  }
}
