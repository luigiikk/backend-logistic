import { PrismaWarehousesRepository } from "@/repositories/prisma-warehouses-repository.js";

export async function deleteWarehouseService(id: number, company_id: number) {

  const repository = new PrismaWarehousesRepository();
  
  return await repository.deleteWarehouse(id, company_id);
}