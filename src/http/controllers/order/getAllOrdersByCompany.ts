import { FastifyRequest, FastifyReply } from "fastify";
import { getAllOrdersByCompanyService } from "@/services/order/getAllOrdersByCompany.js";

export async function getAllOrdersByCompany(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    await request.jwtVerify();
    const company_id = request.user.sub;

    if(request.user.role != "company"){
      return reply.status(409).send();
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
