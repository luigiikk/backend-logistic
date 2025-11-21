import { prisma } from "@/lib/prisma.js";
import { Prisma } from "@prisma/client";


export class PrismaCategoryRepository {
  
  async create(data: Prisma.Category_ResourceCreateInput){
    const category = await prisma.category_Resource.create({
      data,
    });

    return category;
  }
}