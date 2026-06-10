import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { createVehicleMaintenanceService } from "@/services/maintenance-vehicle/registerMaintenance.js";
 
export const vehicleMaintenanceCreateBodySchema = z.object({
  type: z.string(),
  description: z.string().optional(),
  cost: z.number().positive().optional(),
  mileage: z.number().int().positive().optional(),
  performed_at: z.string().optional(),
  next_due_at: z.string().optional(),
  performed_by: z.string().optional(),
});
 
type CreateMaintenanceBody = z.infer<typeof vehicleMaintenanceCreateBodySchema>;
 
export async function createVehicleMaintenance(
  request: FastifyRequest<{
    Params: { vehicle_id: number };
    Body: CreateMaintenanceBody;
  }>,
  reply: FastifyReply
) {
  const { type, description, cost, mileage, performed_at, next_due_at, performed_by } =
    request.body;
  const { vehicle_id } = request.params;
 
  await request.jwtVerify();
  const company_id = request.user.sub;
 
  try {
    const maintenance = await createVehicleMaintenanceService({
      vehicle_id,
      company_id,
      type,
      description,
      cost,
      mileage,
      performed_at: performed_at ? new Date(performed_at) : undefined,
      next_due_at: next_due_at ? new Date(next_due_at) : undefined,
      performed_by,
    });
 
    return reply.status(201).send(maintenance);
  } catch (error) {
    return reply.status(409).send(error);
  }
}