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

  async getAllEmployeesByCompany(company_id: number) {
  return await prisma.employees.findMany({
    where: { company_id }, 
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
    const employee = await prisma.employees.findFirst({
      where: {
        id,
        company_id,
      },
      include: {
      role: true, 
      addres: true
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
  const employee = await prisma.employees.update({
    where: {
      id,
      company_id,
    },
    data,
  });

  if (!employee) {
    throw new Error("Employee not found or does not belong to this company");
  }

  await prisma.employees.update({
    where: { id, company_id },
    data,
  });
}
}
