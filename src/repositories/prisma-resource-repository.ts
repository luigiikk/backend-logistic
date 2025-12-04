import { prisma } from "@/lib/prisma.js";
import { Prisma } from "@prisma/client";


export class PrismaResourceRepository {
  
  async create(data: Prisma.ResourcesCreateInput){
    const resource = await prisma.resources.create({
      data,
    });

    return resource;
  }
}