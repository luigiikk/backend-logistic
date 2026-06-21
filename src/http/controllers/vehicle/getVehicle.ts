import { FastifyRequest, FastifyReply } from "fastify";
import { getVehicleService } from "@/services/vehicle/getVehicle.js";
import { prisma } from "@/lib/prisma.js";

export async function getVehicle(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: number };

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

  const vehicle = await getVehicleService(id, company_id);

    return reply.status(200).send(vehicle);
  } catch (error) {
    return reply.status(409).send(error);
  }
}
