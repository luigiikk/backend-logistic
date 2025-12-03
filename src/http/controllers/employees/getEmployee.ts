import { FastifyRequest, FastifyReply } from "fastify";
import { getEmployeeService } from "@/services/employees/getEmployee.js";

export async function getEmployee(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as {id: number};

  try {
    await request.jwtVerify();
    const company_id = request.user.sub;

    if(request.user.role != "company"){
      return reply.status(409).send();
    }

    const employee = await getEmployeeService(id, company_id)

    const response = {
      name: employee.name,
      enrollment: employee.enrollment, 
      role_name: employee.role.name,
      company_id: employee.company_id,
      email: employee.email,
      phone_number: employee.phone_number,
    }; 
    return reply.status(200).send(response);
  } catch (error) {
    return reply.status(409).send(error);
  }  
}
