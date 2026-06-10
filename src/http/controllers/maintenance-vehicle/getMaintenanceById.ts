import { getVehicleMaintenanceService } from "@/services/maintenance-vehicle/getMaintenanceById.js";
import { FastifyReply, FastifyRequest } from "fastify";

export async function getVehicleMaintenance(
  request: FastifyRequest<{ Params: { vehicle_id: number; id: number } }>,
  reply: FastifyReply
) {
  const { vehicle_id, id } = request.params;
 
  await request.jwtVerify();
  const company_id = request.user.sub;
 
  try {
    const maintenance = await getVehicleMaintenanceService(id, vehicle_id, company_id);
 
    return reply.status(200).send(maintenance);
  } catch (error) {
    return reply.status(404).send(error);
  }
}