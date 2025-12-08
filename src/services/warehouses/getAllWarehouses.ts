import { PrismaWarehousesRepository } from "@/repositories/prisma-warehouses-repository.js";

export async function getAllWarehousesService(company_id: number) {

  const repository = new PrismaWarehousesRepository();
  
  return await repository.getAllWarehouses(company_id);
}