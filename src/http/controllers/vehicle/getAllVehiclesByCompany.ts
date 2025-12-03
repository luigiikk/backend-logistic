import { FastifyRequest, FastifyReply } from "fastify";
import { getAllVehiclesByCompanyService } from "@/services/vehicle/getAllVehiclesByCompany.js";

export async function getAllVehiclesByCompany(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const vehicle = await getAllVehiclesByCompanyService();
    const formattedVehicles = vehicle.map((vehicle) => ({
      plate: vehicle.plate ?? "",
      model: vehicle.model ?? "",
      capacity: vehicle.capacity ?? 0,
      status: vehicle.status.name,
    }));

    return reply.status(200).send(formattedVehicles);
  } catch (error) {
    return reply.status(500).send();
  }
}
