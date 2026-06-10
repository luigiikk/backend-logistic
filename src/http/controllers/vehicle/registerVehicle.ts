import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { registerVehicleService } from "@/services/vehicle/registerVehicle.js";

const documentSchema = z.object({
  type: z.string(),
  number: z.string().optional(),
  issued_at: z.string().optional(),
  expires_at: z.string().optional(),
  file_url: z.string().optional(),
  notes: z.string().optional(),
});

const maintenanceSchema = z.object({
  type: z.string(),
  description: z.string().optional(),
  cost: z.number().positive().optional(),
  mileage: z.number().int().positive().optional(),
  performed_at: z.string().optional(),
  next_due_at: z.string().optional(),
  performed_by: z.string().optional(),
});

export const vehicleRegisterBodySchema = z.object({
  plate: z.string(),
  model: z.string(),
  total_volume: z.coerce.number().positive(),
  status_id: z.number().int().optional(),
  documents: z.array(documentSchema).optional(),
  maintenances: z.array(maintenanceSchema).optional(),
});

type RegisterBody = z.infer<typeof vehicleRegisterBodySchema>;

export async function registerVehicle(
  request: FastifyRequest<{ Body: RegisterBody }>,
  reply: FastifyReply
) {
  const { plate, model, total_volume, status_id, documents, maintenances } =
    request.body;

  await request.jwtVerify();
  const company_id = request.user.sub;

  try {
    const vehicle = await registerVehicleService({
      plate,
      model,
      total_volume,
      status_id,
      company_id,
      documents,
      maintenances,
    });

    return reply.status(201).send(vehicle);
  } catch (error) {
    return reply.status(409).send(error);
  }
}