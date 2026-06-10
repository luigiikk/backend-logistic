import { deleteVehicleMaintenanceService } from "@/services/maintenance-vehicle/deleteMaintenance.js";
import { FastifyReply, FastifyRequest } from "fastify";

export async function deleteVehicleMaintenance(
  request: FastifyRequest<{ Params: { vehicle_id: number; id: number } }>,
  reply: FastifyReply
) {
  const { vehicle_id, id } = request.params;
 
  await request.jwtVerify();
  const company_id = request.user.sub;
 
  try {
    await deleteVehicleMaintenanceService(id, vehicle_id, company_id);
 
    return reply.status(200).send("Maintenance deleted");
  } catch (error) {
    return reply.status(404).send(error);
  }
}