import { FastifyRequest, FastifyReply } from "fastify";
import { getAllEmployeesByCompanyService } from "@/services/employees/getAllEmployeesByCompany.js";


export async function getAllEmployeesByCompany(
  request: FastifyRequest,
  reply: FastifyReply
) {

  try {
    const employees = await getAllEmployeesByCompanyService();
    const formattedEmployees = employees.map((emp) => {
      return {
        ...emp, 
        role: emp.role?.name || "Sem Cargo", 
      };
    });

    return reply.status(200).send(formattedEmployees);
  } catch (error) {
    return reply.status(409).send();
  }  
}
