import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { getStatusByTypeService } from "@/services/status/getStatusByType.js";
import { prisma } from "@/lib/prisma.js";

const getStatusByTypeParams = z.object({
  type: z.enum(["order", "vehicle", "invoice", "purchase_order"]),
});

export async function getStatusByType(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();

    let company_id = request.user.sub;

    if (request.user.role !== "company") {
      const employee = await prisma.employees.findUnique({
        where: { id: Number(request.user.sub) },
      });
      if (!employee) {
        return reply.status(409).send({ error: "Unauthorized role" });
      }
      company_id = employee.company_id;
    }

    const { type } = getStatusByTypeParams.parse(request.params); // valida o type

    const statuses = await getStatusByTypeService(company_id, type);

    return reply.status(200).send(statuses);
  } catch (error) {
    return reply.status(409).send({ error: (error as Error).message });
  }
}
