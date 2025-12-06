import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma.js";
import type { EmployeeUpdateParams } from "@/services/employees/updateEmployee.js";
import { AddresRegisterParams } from "@/services/addres/registerAddres.js";
import { AddresUpdateParams } from "@/services/addres/updateAddres.js";

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
        id: true,
        name: true,
        enrollment: true,
        email: true,
        phone_number: true,
        role: { 
          select: { id: true, name: true }
        },
        addres: {
              select: {
                country: true,
                street: true,
                number: true,
                city: true,
                state: true,
                complement: true,
                zipcode: true,
              }
            }
      },
    });
  }

  async getAllEmployeesByName(company_id: number, name: string) {
    return await prisma.employees.findMany({
      where: { company_id, name },
      select: {
        name: true,
        enrollment: true,
        email: true,
        phone_number: true,
        role: { 
          select: { name: true }
        },
        company: {
          select: {
            addres: {
              select: {
                country: true,
                street: true,
                number: true,
                city: true,
                state: true,
                complement: true,
                zipcode: true,
              }
            }
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

  async updateEmployee(id: number, company_id: number, data: EmployeeUpdateParams, addressData: AddresUpdateParams) {
    console.log(data,id,company_id)
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

  if (employee.addres_id !== null) {
  await prisma.addres.update({
    where: {
      id: employee.addres_id,
    },

    data: {
      street: addressData.street,
      city: addressData.city,
      zipcode: addressData.zipcode,
      country: addressData.country,
      complement: addressData.complement,
      number: addressData.number,

    },
  });
}


  await prisma.employees.update({
    where: { id, company_id },  
    data,
  });
}
}
