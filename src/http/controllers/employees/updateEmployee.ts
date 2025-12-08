import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { updateEmployeeService } from "@/services/employees/updateEmployee.js";
import { addresRegisterBodySchema } from "../addres/registerAddres.js";
import { addresUpdateBodySchema } from "../addres/updateAddres.js";

export const employeeUpdateBodySchema = z.object({
  name: z.string(),
  employee_roles: z.number().int(),
  email: z.email(),
  phone_number: z.string(),
  addressData: addresUpdateBodySchema,
});

type RegisterBody = z.infer<typeof employeeUpdateBodySchema>;

export async function updateEmployee(
  request: FastifyRequest<{ Params: { id: number }; Body: RegisterBody }>,
  reply: FastifyReply
) {
  const { name, employee_roles, email, phone_number, addressData } = request.body;
  const id = Number(request.params.id);

  try {
    await request.jwtVerify();
    const user = request.user;
    const company_id = user.sub;

    await updateEmployeeService(id, company_id, { name, employee_roles, email, phone_number, }, addressData);
  } catch (error) {
    return reply.status(409).send();
  }

  return reply.status(200).send({ message: "Employee updated successfully" });
}
