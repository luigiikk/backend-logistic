import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { allocateVehicleToOrderService } from "@/services/order/allocateVehicleToOrder.js";
import { prisma } from "@/lib/prisma.js";

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

  try {
    await allocateVehicleToOrderService({ order_id, vehicle_id, company_id });
  } catch (error) {
    return reply.status(409).send({
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }

  return reply.status(200).send(null);
}