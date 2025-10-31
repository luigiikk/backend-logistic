import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { registerEmployeeService } from "@/services/employees/registerEmployee.js";

export const employeeRegisterBodySchema = z.object({
  name: z.string(),
  employee_roles: z.number().int(),
  company_id: z.number().int(),
  email: z.email(),
  phone_number: z.string(),
  password: z.string().min(6),
});

type RegisterBody = z.infer<typeof employeeRegisterBodySchema>;

export async function registerEmployee(
  request: FastifyRequest<{ Body: RegisterBody }>,
  reply: FastifyReply
) {
  const { name, employee_roles, company_id, email, phone_number, password } = request.body;

  try {
    await registerEmployeeService({ name, employee_roles, company_id, email, phone_number, password });
  } catch (error) {
    return reply.status(409).send();
  }

  return reply.status(201).send(null);
}
