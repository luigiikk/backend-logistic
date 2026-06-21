import { FastifyRequest, FastifyReply } from "fastify";
import { getAllVehiclesByCompanyService } from "@/services/vehicle/getAllVehiclesByCompany.js";
import { prisma } from "@/lib/prisma.js";

export async function getAllVehiclesByCompany(
  request: FastifyRequest<{ Querystring: { status?: string } }>,
  reply: FastifyReply
) {
  try {
    await request.jwtVerify();
    let company_id = request.user.sub;

    if (request.user.role !== "company") {
      const employee = await prisma.employees.findUnique({
        where: { id: Number(request.user.sub) },
      });
      if (!employee) {
        return reply.status(409).send();
      }
      company_id = employee.company_id;
    }

    const { status } = request.query;

    const vehicles = await getAllVehiclesByCompanyService(company_id, status);
    const formattedVehicles = vehicles.map((vehicle) => {

      return {
        id: vehicle.id,
        plate: vehicle.plate ?? "",
        model: vehicle.model ?? "",
        total_volume: vehicle.total_volume,
        available_volume: vehicle.available_volume, 
        status: vehicle.status.name,
      };
    });

    return reply.status(200).send(formattedVehicles);
  } catch (error) {
    return reply.status(500).send();
  }
}
