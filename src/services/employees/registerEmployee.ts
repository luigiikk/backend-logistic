import { prisma } from "@/lib/prisma.js";
import { PrismaEmployeesRepository } from "@/repositories/prisma-employees-repository.js";
import { hash } from "bcryptjs";
import { generateEnrollmentNumber } from "@/util/generateEnrollmentNumber.js";

interface EmployeesRegisterParams {
  name: string;
  employee_roles: number;
  company_id: number;
  email: string;
  phone_number: string;
  password: string;
}

export async function registerEmployeeService({
  name,
  employee_roles,
  company_id,
  email,
  phone_number,
  password,
}: EmployeesRegisterParams) {
  const password_hash = await hash(password, 6);

  const employeeWithSameEmail = await prisma.employees.findUnique({
    where: {
      email,
    },
  });

  if (employeeWithSameEmail) {
    throw new Error("Email already exists");
  }

  const prismaEmployeesRepository = new PrismaEmployeesRepository();

  const enrollment = await generateEnrollmentNumber();

  const employee = await prismaEmployeesRepository.create({
    name,
    enrollment,
    role: {
      connect: { id: employee_roles },
    },
    company: {
      connect: { id: company_id },
    },
    email,
    phone_number,
    password_hash,
  });

  return employee;
}
