import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { registerOrderTrackingService } from "@/services/order/tracking/registerOrderTrackingService.js";
import { prisma } from "@/lib/prisma.js";

export const orderTrackingParamsSchema = z.object({
  id: z.coerce.number().int(),
});

export const orderTrackingRegisterBodySchema = z.object({
  status_id: z.number().int(),

  location: z.string().nullable().optional(),

  description: z.string().min(3).nullable().optional(),

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
  
  let company_id = request.user.sub;

  if (request.user.role !== "company") {
    const employee = await prisma.employees.findUnique({
      where: { id: Number(request.user.sub) },
    });
    if (!employee) {
      return reply.status(409).send({ message: "Employee not found" });
    }
    company_id = employee.company_id;
  }

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
