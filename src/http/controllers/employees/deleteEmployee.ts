import { deleteEmployeeService } from "@/services/employees/deleteEmployee.js";
import { FastifyRequest, FastifyReply } from "fastify";

export async function deleteEmployee(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as {id: number};

  try {
    const employee = await deleteEmployeeService(id);
    return reply.status(200).send(employee);
  } catch (error) {
    return reply.status(409).send(error);
  }  
}
