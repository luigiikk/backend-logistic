import { PrismaWarehousesRepository } from "@/repositories/prisma-warehouses-repository.js";

export async function getWarehouseByIdService(id: number) {

  const repository = new PrismaWarehousesRepository();
  
  return await repository.getWarehouseById(id);
}