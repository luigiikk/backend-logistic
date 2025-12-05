import { PrismaEmployeesRepository } from "@/repositories/prisma-employees-repository.js";

export async function getAllEmployeesByNameService(company_id: number, name: string) {
  const prismaEmployeesRepository = new PrismaEmployeesRepository;

  const employees = await prismaEmployeesRepository.getAllEmployeesByName(company_id, name);

  return employees;
}
