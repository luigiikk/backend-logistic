import { updateVehicleMaintenanceService } from "@/services/maintenance-vehicle/updateMaintenance.js";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export const vehicleMaintenanceUpdateBodySchema = z.object({
  type: z.string().optional(),
  description: z.string().optional(),
  cost: z.number().positive().optional(),
  mileage: z.number().int().positive().optional(),
  performed_at: z.string().optional(),
  next_due_at: z.string().optional(),
  performed_by: z.string().optional(),
});

type UpdateMaintenanceBody = z.infer<typeof vehicleMaintenanceUpdateBodySchema>;

export async function updateVehicleMaintenance(
  request: FastifyRequest<{
    Params: { vehicle_id: number; id: number };
    Body: UpdateMaintenanceBody;
  }>,
  reply: FastifyReply,
) {
  const {
    type,
    description,
    cost,
    mileage,
    performed_at,
    next_due_at,
    performed_by,
  } = request.body;
  const { vehicle_id, id } = request.params;

  await request.jwtVerify();
  const company_id = request.user.sub;

  try {
    const updated = await updateVehicleMaintenanceService(
      id,
      vehicle_id,
      company_id,
      {
        type,
        description,
        cost,
        mileage,
        performed_at: performed_at ? new Date(performed_at) : undefined,
        next_due_at: next_due_at ? new Date(next_due_at) : undefined,
        performed_by,
      },
    );

    return reply.status(200).send(updated);
  } catch (error) {
    return reply.status(409).send(error);
  }
}
