import { prisma } from "@/lib/prisma.js";
import { PrismaEmployeesRepository } from "@/repositories/prisma-employees-repository.js";


export async function deleteEmployeeService(id: number) {
  const employees = await prisma.employees.findFirst({
    where: {
      id,
    }
  })
  
  if(!employees){
    throw new Error('employee not exists');
  }

  const prismaEmployeesRepository = new PrismaEmployeesRepository;

  try {
    await prismaEmployeesRepository.deleteEmployee(employees.id);
  } catch(error) {
    throw new Error("Error deleting employee");
  }
  
}
