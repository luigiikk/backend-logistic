import { FastifyRequest, FastifyReply } from "fastify";
import { getAllVehiclesByCompanyService } from "@/services/vehicle/getAllVehiclesByCompany.js";

export async function getAllVehiclesByCompany(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    await request.jwtVerify();
    const company_id = request.user.sub;

    if(request.user.role != "company"){
      return reply.status(409).send();
    }

    const vehicle = await getAllVehiclesByCompanyService(company_id);
    const formattedVehicles = vehicle.map((vehicle) => ({
      id: vehicle.id,
      plate: vehicle.plate ?? "",
      model: vehicle.model ?? "",
      total_volume: vehicle.total_volume,
      status: vehicle.status.name,
    }));

    return reply.status(200).send(formattedVehicles);
  } catch (error) {
    return reply.status(500).send();
  }
}
