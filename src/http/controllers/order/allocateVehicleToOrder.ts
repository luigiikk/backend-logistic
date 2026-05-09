import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { allocateVehicleToOrderService } from "@/services/order/allocateVehicleToOrder.js";

const paramsSchema = z.object({
  order_id: z.coerce.number(),
});

const bodySchema = z.object({
  vehicle_id: z.number().int(),
});

export async function allocateVehicleToOrder(
  request: FastifyRequest<{
    Params: z.infer<typeof paramsSchema>;
    Body: z.infer<typeof bodySchema>;
  }>,
  reply: FastifyReply
) {
  const { order_id } = paramsSchema.parse(request.params);
  const { vehicle_id } = bodySchema.parse(request.body);

  await request.jwtVerify();
  const company_id = request.user.sub;

  try {
    await allocateVehicleToOrderService({ order_id, vehicle_id, company_id });
  } catch (error) {
    return reply.status(409).send({
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }

  return reply.status(200).send(null);
}