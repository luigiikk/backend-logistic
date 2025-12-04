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
}
