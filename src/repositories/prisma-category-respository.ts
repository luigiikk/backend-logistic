import { prisma } from "@/lib/prisma.js";

export class PrismaCategoryRepository {
  async getAllCategory() {
    return await prisma.category_Resource.findMany();
  }

  async getCategoryById(id: number) {
    return await prisma.category_Resource.findUnique({
      where: {
        id,
      }
    });
  }
}