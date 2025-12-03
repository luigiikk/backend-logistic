import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma.js";
import type { EmployeeUpdateParams } from "@/services/employees/updateEmployee.js";

export class PrismaEmployeesRepository {
  async create(data: Prisma.EmployeesCreateInput) {
    const employee = await prisma.employees.create({
      data,
    });
    return employee;
  }

  async getEmployeeByEnrollment(enrollment: string) {
    const employee = await prisma.employees.findUnique({
      where: {
        enrollment,
      },
      include: { role: true }
    });

    return employee;
  }

  async getAllEmployeesByCompany() {
  return await prisma.employees.findMany({
    select: {
      name: true,
      enrollment: true,
      email: true,
      phone_number: true,
          role: { 
        select: {
          name: true 
        }
      }
    },
  });
}
  async getEmployee(id: number, company_id: number) {
    const employee = await prisma.employees.findUnique({
      where: {
        id,
        company_id,
      },
      include: {
      role: true, 
  },
    });
    return employee;
  }

  async deleteEmployee(id: number) {
    const employee = await prisma.employees.delete({
      where: {
        id,
      },
    });
    return employee;
  }

  async updateEmployee(id: number, company_id: number, data: EmployeeUpdateParams) {
    const employeeExists = await prisma.employees.findUnique({ where: { id } });
    
    if (!employeeExists) {
      throw new Error("employee not found");
    }

    if(company_id != employeeExists.company_id){
      throw new Error("employee not update");
    }
    await prisma.employees.update({
      where: { id },
      data,
    });
  }
}
