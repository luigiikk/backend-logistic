import { FastifyRequest, FastifyReply } from "fastify";
import { getAllInvoicesService } from "@/services/invoice/getAllinvoice.js";
import { prisma } from "@/lib/prisma.js";

export async function getAllInvoices(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {

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

    const invoices = await getAllInvoicesService(company_id);
    return reply.status(200).send(invoices);
  } catch (error) {
    return reply.status(500).send();
  }
}
