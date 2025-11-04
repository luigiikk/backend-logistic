import { FastifyRequest, FastifyReply } from "fastify";
import {z} from "zod"
import { registerOrderService } from "@/services/order/registerOrder.js";

export const orderRegisterBodySchema = z.object({
    sender_client_id: z.number().int(),
    recipient_id: z.number().int(),
    status_id: z.number().int(),
    company_id: z.number().int(),
    vehicle_id: z.number().int(),
});

type RegisterBody = z.infer<typeof orderRegisterBodySchema>

export async function registerOrder(
  request: FastifyRequest<{ Body: RegisterBody }>,
  reply: FastifyReply
) {
  const {sender_client_id, recipient_id, status_id, company_id, vehicle_id } = request.body;

  try {
    await registerOrderService({sender_client_id, recipient_id, status_id, company_id, vehicle_id });
  } catch (error) {
    return reply.status(409).send();
  }
  return reply.status(201).send(null);
}