import { prisma } from "@/lib/prisma.js";
import { Prisma } from "@prisma/client";

export class PrismaProductsRepository {
  async create(data: Prisma.ProductsCreateInput) {
    const product = await prisma.products.create({
      data,
    });

    return product;
  }

  async getAllProducts() {
    return await prisma.products.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        quantity: true,
        order_id: true,
      },
    });
  }

  async getProduct(id: number) {
    const product = await prisma.products.findUnique({
      where: {
        id,
      },
    });

    return product;
  }

  async deleteProduct(id: number) {
    await prisma.products.delete({
      where: {
        id,
      },
    });
  }
}
