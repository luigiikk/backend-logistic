import { PrismaEmployeesRepository } from "@/repositories/prisma-employees-repository.js";


export async function getEmployeeService(id: number) {
  const prismaEmployeesRepository = new PrismaEmployeesRepository;

  const employee = await prismaEmployeesRepository.getEmployee(id);

  if(!employee){
    throw new Error('employee not found');
  }
  return employee;
}
