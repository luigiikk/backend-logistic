import { FastifyRequest, FastifyReply } from "fastify";
import { getOrderService } from "@/services/order/getOrder.js";
import { prisma } from "@/lib/prisma.js";

export async function getOrder(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: number };

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
    
    const order = await getOrderService(id, company_id);
    const response = {
      code: order.code ?? "",
      sender_client: order.sender_client?.name,
      recipient: order.recipient.name,
      status: order.status.name,
    
      vehicle: order.vehicle
        ? { plate: order.vehicle.plate }
        : null,
    
      products: order.products.map((item) => ({
        name: item.name ?? null,
        quantity: item.quantity,
        height: item.height,
        width: item.width,
        length: item.length,
        volume: item.volume,
      })),
    };
    
    return reply.status(200).send(response);
  } catch (error) {
    return reply.status(409).send(error);
  }
}
