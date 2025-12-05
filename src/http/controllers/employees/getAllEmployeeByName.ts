import { FastifyRequest, FastifyReply } from "fastify";
import { getAllEmployeesByCompanyService } from "@/services/employees/getAllEmployeesByCompany.js";
import { getAllEmployeesByNameService } from "@/services/employees/getAllEmployeeByName.js";


type GetEmployeesByNameQuery = {
  name: string
}

export async function getAllEmployeesByName(
  request: FastifyRequest<{ Querystring: GetEmployeesByNameQuery }>,
  reply: FastifyReply
) {
  try {
    await request.jwtVerify();
    const company_id = request.user.sub;

    const { name } = request.query;

    console.log(name)

    if (request.user.role != "company") {
      return reply.status(409).send();
    }

    const employees = await getAllEmployeesByNameService(company_id, name);

    const formattedEmployees = employees.map((emp) => {
      return {
        ...emp,
        role: emp.role?.name || "Sem Cargo",
        address: emp.company?.addres || null,
      };
    });

    return reply.status(200).send(formattedEmployees);
  } catch (error) {
    return reply.status(409).send();
  }
}