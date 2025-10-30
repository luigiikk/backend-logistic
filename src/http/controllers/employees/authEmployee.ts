import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { authEmployeeService } from "@/services/employees/authEmployee.js";
import { InvalidCredentialsError } from "@/services/erros/invalid-credentials-error.js";
import { prisma } from "@/lib/prisma.js";


export const employeeAuthBodySchema = z.object({
  enrollment: z.string(),
  password: z.string().min(6),
});

type EmployeeAuthBody = z.infer<typeof employeeAuthBodySchema>;

export async function authEmployee(
  request: FastifyRequest<{ Body: EmployeeAuthBody }>,
  reply: FastifyReply
) {
  const { enrollment, password } = request.body;

  try {
    const employee = await authEmployeeService({ enrollment, password });
    const employeeRoles = await prisma.roles.findUnique({
        where: {
            id: employee.employee_roles,
        },
    })

    if(!employeeRoles){
        return reply.status(400).send({message: "role não encontrada"})
    }
    const token = await reply.jwtSign(
      { sub: employee.id, role: employeeRoles.name ?? "empregado" },
      { expiresIn: "1d" }
    );
    
    return reply.status(200).send({ token });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message });
    }

    throw error;
  }
}
