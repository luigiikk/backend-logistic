import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { registerOrderTrackingService } from "@/services/order/tracking/registerOrderTrackingService.js";

export const orderTrackingParamsSchema = z.object({
  id: z.coerce.number().int(),
});

export const orderTrackingRegisterBodySchema = z.object({
  status_id: z.number().int(),

  location: z.string().nullable().optional(),

  description: z.string().min(3),

  estimated_delivery: z
    .string()
    .datetime()
    .nullable()
    .optional(),
});

type RegisterBody = z.infer<typeof orderTrackingRegisterBodySchema>;

export async function registerOrderTracking(
  request: FastifyRequest<{ Body: RegisterBody }>,
  reply: FastifyReply
) {
  const {
    status_id,
    location,
    description,
    estimated_delivery
  } = request.body;

  const { id: order_id } = request.params as { id: number };

  await request.jwtVerify();
  const company_id = request.user.sub;

  try {
    await registerOrderTrackingService({
    order_id,
    company_id,
    status_id,
    location,
    description,
    estimated_delivery
    });
  } catch (error) {
  console.error(error); 
  return reply.status(409).send({
    message: error instanceof Error ? error.message : "Unknown error"
  });
}

  return reply.status(201).send(null);
}
