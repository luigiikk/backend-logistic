import { PrismaEmployeesRepository } from "@/repositories/prisma-employees-repository.js";

export interface EmployeeUpdateParams {
  name: string;
  employee_roles:number,
  email: string;
  phone_number: string;
}

export async function updateEmployeeService(id:number, {
  name,
  employee_roles,
  email,
  phone_number,
}: EmployeeUpdateParams) {
 
  const prismaEmployeesRepository = new PrismaEmployeesRepository;

  await prismaEmployeesRepository.updateEmployee(id, {
    name,
    employee_roles,
    email,
    phone_number
  });
}
