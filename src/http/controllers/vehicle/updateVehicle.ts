import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { updateVehicleService } from "@/services/vehicle/updateVehicle.js";

export const vehicleUpdateBodySchema = z.object({
  plate: z.string(),
  model: z.string(),
  capacity: z.number().int(),
  status_id: z.number().int(),
  company_id: z.number().int(),
});

type RegisterBody = z.infer<typeof vehicleUpdateBodySchema>;

export async function updateVehicle(
  request: FastifyRequest<{ Params: { id: number }; Body: RegisterBody }>,
  reply: FastifyReply
) {
  const {plate, model, capacity,  status_id, company_id } = request.body;
  const { id } = request.params;

  try {
    await updateVehicleService(id, {
      plate,
      model,
      capacity,
      status_id,
      company_id,
    });
  } catch (error) {
    return reply.status(409).send();
  }

  return reply.status(200).send({ message: "Vehicle updated successfully" });
}
