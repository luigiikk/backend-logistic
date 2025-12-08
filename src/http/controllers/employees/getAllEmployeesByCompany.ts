import { FastifyRequest, FastifyReply } from "fastify";
import { getAllEmployeesByCompanyService } from "@/services/employees/getAllEmployeesByCompany.js";


export async function getAllEmployeesByCompany(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    await request.jwtVerify();
    const company_id = request.user.sub;

    if (request.user.role != "company") {
      return reply.status(409).send();
    }
    
    const employees = await getAllEmployeesByCompanyService(company_id);

    return reply.status(200).send(employees);
  } catch (error) {
    return reply.status(409).send();
  }
}