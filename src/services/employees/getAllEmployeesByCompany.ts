import { PrismaEmployeesRepository } from "@/repositories/prisma-employees-repository.js";

export async function getAllEmployeesByCompanyService(company_id: number) {
  const prismaEmployeesRepository = new PrismaEmployeesRepository;

  const employees = await prismaEmployeesRepository.getAllEmployeesByCompany(company_id);

  return employees;
  
}
