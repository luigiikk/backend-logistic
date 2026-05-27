import { deletePurchaseOrderService } from "@/services/purchaseOrders/deletePurchaseOrder.js";
import { FastifyRequest, FastifyReply } from "fastify";

export async function deletePurchaseOrder(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  await request.jwtVerify();
  const company_id = Number(request.user.sub);

  if (request.user.role !== "company") return reply.status(403).send();

  const id = Number(request.params.id);

  try {
    await deletePurchaseOrderService(id, company_id);
    return reply.status(200).send({ message: "Purchase order deleted successfully" });
  } catch (error) {
    console.error("Erro ao deletar pedido:", error);
    return reply.status(500).send({ error: "Could not delete purchase order." });
  }
}