import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { registerVehicleService } from "@/services/vehicle/registerVehicle.js";

export const vehicleRegisterBodySchema = z.object({
  plate: z.string(),
  model: z.string(),
  capacity: z.number().int(),
  status_id: z.number().int(),
  company_id: z.number().int(),
});

type RegisterBody = z.infer<typeof vehicleRegisterBodySchema>;

export async function registerVehicle(
  request: FastifyRequest<{ Body: RegisterBody }>,
  reply: FastifyReply
) {
  const { plate, model, capacity, status_id,  company_id } = request.body;

  try {
    await registerVehicleService({ plate, model, capacity, status_id, company_id });
  } catch (error) {
    return reply.status(409).send();
  }

  return reply.status(201).send(null);
}
