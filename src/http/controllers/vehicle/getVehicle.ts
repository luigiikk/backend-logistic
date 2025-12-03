import { FastifyRequest, FastifyReply } from "fastify";
import { getVehicleService } from "@/services/vehicle/getVehicle.js";

export async function getVehicle(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: number };

   try {
    await request.jwtVerify();
    const company_id = request.user.sub;

    if (request.user.role !== "company") {
      return reply.status(409).send();
    }

    const vehicle = await getVehicleService(id, company_id);

    const response = {
      plate: vehicle.plate,
      model: vehicle.model,
      capacity: vehicle.capacity,
      status: vehicle.status.name,
    };

    return reply.status(200).send(response);
  } catch (error) {
    return reply.status(409).send(error);
  }
}
