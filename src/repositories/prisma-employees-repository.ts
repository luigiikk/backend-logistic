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

  async getAllEmployees() {
    return await prisma.employees.findMany({
      select: {
        id: true,
        name: true,
        enrollment: true,
        employee_roles: true,
        company_id: true,
        email: true,
        phone_number: true,
      },
    });
  }
  async getEmployee(id: number) {
    const employee = await prisma.employees.findUnique({
      where: {
        id,
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

  async updateEmployee(id: number, data: EmployeeUpdateParams) {
    const employeeExists = await prisma.employees.findUnique({ where: { id } });
    
    if (!employeeExists) {
      throw new Error("employee not found");
    }
    await prisma.employees.update({
      where: { id },
      data,
    });
  }

  async getEmployeesByCompany(company_id:number){
    const employess = await prisma.employees.findMany({
      where:{
        company_id,
      },
      select: {
      id: true,
      name: true,
      enrollment: true,
      employee_roles: true,
      company_id: true,
      email: true,
      phone_number: true,
    },
    });
    return employess;
  }
}
