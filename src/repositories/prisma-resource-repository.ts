import { prisma } from "@/lib/prisma.js";
import { Prisma } from "@prisma/client";

type UpdateResourceData = {
  name?: string
  height?: number
  width?: number
  depth?: number
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
    return await prisma.resources.findMany({
      where: {
        company_id,
      },
      include: {
        category: true,
      },
    });
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
        depth: data.depth,
      },
      include: {
        category: true,
      }
    });
  
    return resource;
  }
}
