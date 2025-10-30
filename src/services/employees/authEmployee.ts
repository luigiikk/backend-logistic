import { PrismaEmployeesRepository } from "@/repositories/prisma-employees-repository.js";
import { compare } from "bcryptjs";
import { InvalidCredentialsError } from "../erros/invalid-credentials-error.js";


interface EmployeeAuthParams {
  enrollment: string;
  password: string;
}

export async function authEmployeeService({
  enrollment,
  password,
}: EmployeeAuthParams
) {

  const prismaEmployeesRepository = new PrismaEmployeesRepository();

  const employee = await prismaEmployeesRepository.getEmployeeByEnrollment(enrollment);

  if(!employee){
    throw new InvalidCredentialsError();
  }

  const doesPasswordMatches = await compare(password, employee.password_hash);

  if(!doesPasswordMatches){
    throw new  InvalidCredentialsError();
  }

  return employee;
}
