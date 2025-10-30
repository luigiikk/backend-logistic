import { FastifyRequest, FastifyReply } from "fastify";
import { getAllEmployeesService } from "@/services/employees/getAllEmployees.js";


export async function getAllEmployees(
  request: FastifyRequest,
  reply: FastifyReply
) {

  try {
    const employee = await getAllEmployeesService();
    return reply.status(200).send(employee);
  } catch (error) {
    return reply.status(409).send();
  }  
}
