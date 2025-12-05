import { prisma } from "@/lib/prisma.js";
import { Prisma } from "@prisma/client";

export class PrismaSupplierRepository {
  async create(data: Prisma.SupplierCreateInput) {

    const supplier = await prisma.supplier.create({
      data,
    });

    return supplier;
  }

  async update(id: number, data: Prisma.SupplierUpdateInput) {
    return prisma.supplier.update({
      where: { id },
      data
    });
  }

  async getAllSupplierByCompany(company_id: number){
    return prisma.supplier.findMany({
      where: {company_id: company_id },
      include: { addres: true }
    });
  }

  async getSupplierById(id: number, company_id: number){
    return prisma.supplier.findUnique({
      where:{company_id, id},
      include: {addres: true}
    })
  }
}
