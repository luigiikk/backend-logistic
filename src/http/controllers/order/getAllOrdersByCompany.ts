import { FastifyRequest, FastifyReply } from "fastify";
import { getAllOrdersByCompanyService } from "@/services/order/getAllOrdersByCompany.js";
import { prisma } from "@/lib/prisma.js";

export async function getAllOrdersByCompany(
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

    const orders = await getAllOrdersByCompanyService(company_id);
    const formattedOrders = orders.map((ord) => ({
      id: ord.id,
      code: ord.code ?? "",
      sender_client: ord.sender_client?.name ?? "",
      recipient: ord.recipient?.name ?? "",
      status: ord.status?.name ?? "",
      vehicle: ord.vehicle ? { plate: ord.vehicle.plate } : null,
    }));

    return reply.status(200).send(formattedOrders);
  } catch (error) {
    return reply.status(500).send();
  }
}
