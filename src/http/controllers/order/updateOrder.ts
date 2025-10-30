import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { updateOrderService } from "@/services/order/updateOrder.js";

export const orderUpdateBodySchema = z.object({
  sender_client_id: z.number().int(),
  receiver_client_id: z.number().int(),
  status_id: z.number().int(),
  vehicle_id: z.number().int(),
});

type RegisterBody = z.infer<typeof orderUpdateBodySchema>;

export async function updateCompany(
  request: FastifyRequest<{ Params: { id: number }; Body: RegisterBody }>,
  reply: FastifyReply
) {
  const { sender_client_id, receiver_client_id, status_id, vehicle_id } =
    request.body;
  const { id } = request.params;

  try {
    await updateOrderService(id, {
      sender_client_id,
      receiver_client_id,
      status_id,
      vehicle_id,
    });
  } catch (error) {
    return reply.status(409).send();
  }

  return reply.status(200).send({ message: "Order updated successfully" });
}
