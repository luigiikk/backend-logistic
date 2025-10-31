import { PrismaEmployeesRepository } from "@/repositories/prisma-employees-repository.js";

export async function getAllEmployeesService() {
  const prismaEmployeesRepository = new PrismaEmployeesRepository;

  const employees = await prismaEmployeesRepository.getAllEmployees();

  return employees;
}
