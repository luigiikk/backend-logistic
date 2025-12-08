import { prisma } from "@/lib/prisma.js";
import { Prisma } from "@prisma/client";


export class PrismaResourceRepository {
  
  async create(data: Prisma.ResourcesCreateInput){
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
          category: true
        }
      })
    }

}