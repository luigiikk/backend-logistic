import { prisma } from "@/lib/prisma.js";
import { Prisma } from "@prisma/client";

type UpdateResourceData = {
  name?: string
  height?: number
  width?: number
  length?: number
  category_id?: number
}

export class PrismaResourceRepository {
  async create(data: Prisma.ResourcesCreateInput) {
    const resource = await prisma.resources.create({
      data,
    });

    return resource;
  }

  async getAllResource(company_id: number) {
  const resources = await prisma.resources.findMany({
    where: { company_id },
    include: { category: true },
  });

  const inventorySums = await prisma.inventory.groupBy({
    by: ["resource_id"],
    where: { company_id },
    _sum: { quantity: true },
  });

  const sumMap = new Map(
    inventorySums.map((i) => [i.resource_id, i._sum.quantity ?? 0])
  );

  return resources.map((r) => ({
    ...r,
    total_quantity: sumMap.get(r.id) ?? 0,
  }));
}

  async getResourceById(company_id: number, id: number) {
    return await prisma.resources.findUnique({
      where: {
        company_id,
        id,
      },
      include: {
        category: true,
      },
    });
  }

  async updateResource(
    company_id: number,
    id: number,
    data: UpdateResourceData
  ) {
    const resource = await prisma.resources.update({
      where: { id, company_id },
      data: {
        name: data.name,
        category_id: data.category_id,
        height: data.height,
        width: data.width,
        length: data.length,
      },
      include: {
        category: true,
      }
    });
  
    return resource;
  }
}
