import { PrismaEmployeesRepository } from "@/repositories/prisma-employees-repository.js";

export async function getAllEmployeesByCompanyService() {
  const prismaEmployeesRepository = new PrismaEmployeesRepository;

  const employees = await prismaEmployeesRepository.getAllEmployeesByCompany();

  return employees;
}
