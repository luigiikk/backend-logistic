import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { updateVehicleService } from "@/services/vehicle/updateVehicle.js";

export const vehicleUpdateBodySchema = z.object({
  plate: z.string(),
  model: z.string(),
  total_volume: z.coerce.number().positive(),
  status_id: z.number().int(),
});

type RegisterBody = z.infer<typeof vehicleUpdateBodySchema>;

export async function updateVehicle(
  request: FastifyRequest<{ Params: { id: number }; Body: RegisterBody }>,
  reply: FastifyReply
) {
  const {plate, model, total_volume,  status_id } = request.body;
  const { id } = request.params;

  await request.jwtVerify();
  const user = request.user;
  const company_id = user.sub;

  try {
    await updateVehicleService(id, company_id, {
      plate,
      model,
      total_volume,
      status_id,
    });
  } catch (error) {
    return reply.status(409).send(error);
  }

  return reply.status(200).send({ message: "Vehicle updated successfully" });
}
