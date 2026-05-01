import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { registerVehicleService } from "@/services/vehicle/registerVehicle.js";

export const vehicleRegisterBodySchema = z.object({
  plate: z.string(),
  model: z.string(),
  total_volume: z.coerce.number().positive(),
  status_id: z.number().int().optional(),
});

type RegisterBody = z.infer<typeof vehicleRegisterBodySchema>;

export async function registerVehicle(
  request: FastifyRequest<{ Body: RegisterBody }>,
  reply: FastifyReply
) {
  const { plate, model, total_volume, status_id } = request.body;

  await request.jwtVerify();
  const user = request.user;
  const company_id = user.sub

  try {
    await registerVehicleService({ plate, model, total_volume, status_id, company_id });
  } catch (error) {
    return reply.status(409).send(error);
  }

  return reply.status(201).send(null);
}
