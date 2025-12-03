import { FastifyRequest, FastifyReply } from "fastify";
import { getAllOrdersByCompanyService } from "@/services/order/getAllOrdersByCompany.js";

export async function getAllOrdersByCompany(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const orders = await getAllOrdersByCompanyService();
    const formattedOrders = orders.map((ord) => ({
      code: ord.code ?? "",
      sender_client: ord.sender_client?.name ?? "",
      recipient: ord.recipient?.name ?? "",
      status: ord.status?.name ?? "",
      vehicle: ord.vehicle?.plate ?? "",
    }));

    console.log(formattedOrders)
    return reply.status(200).send(formattedOrders);
  } catch (error) {
    return reply.status(500).send();
  }
}
