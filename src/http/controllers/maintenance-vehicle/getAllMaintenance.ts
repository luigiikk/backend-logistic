import { getAllVehicleMaintenancesService } from "@/services/maintenance-vehicle/getAllMaintenance.js";
import { FastifyReply, FastifyRequest } from "fastify";

export async function getAllVehicleMaintenances(
  request: FastifyRequest<{ Params: { vehicle_id: number } }>,
  reply: FastifyReply
) {
  const { vehicle_id } = request.params;
 
  await request.jwtVerify();
  const company_id = request.user.sub;
 
  try {
    const maintenances = await getAllVehicleMaintenancesService(vehicle_id, company_id);
 
    return reply.status(200).send(maintenances);
  } catch (error) {
    return reply.status(400).send(error);
  }
}