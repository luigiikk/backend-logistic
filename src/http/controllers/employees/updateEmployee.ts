import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { updateEmployeeService } from "@/services/employees/updateEmployee.js";

export const employeeUpdateBodySchema = z.object({
  name: z.string(),
  employee_roles: z.number().int(),
  email: z.email(),
  phone_number: z.string(),
});

type RegisterBody = z.infer<typeof employeeUpdateBodySchema>;

export async function updateEmployee(
  request: FastifyRequest<{ Params: { id: number }; Body: RegisterBody }>,
  reply: FastifyReply
) {
  const { name, employee_roles, email, phone_number } = request.body;
  const { id } = request.params;

  try {
    await updateEmployeeService(id, { name, employee_roles, email, phone_number });
  } catch (error) {
    return reply.status(409).send();
  }

  return reply.status(200).send({ message: "Employee updated successfully" });
}
