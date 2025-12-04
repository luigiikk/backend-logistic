import { prisma } from "@/lib/prisma.js";
import { Prisma } from "@prisma/client";


export class PrismaWarehousesRepository {
  
  async create(data: Prisma.WarehousesCreateInput){
    const warehouses = await prisma.warehouses.create({
      data,
    });

    return warehouses;
  }
}