import { PrismaInventoryRepository } from "@/repositories/prisma-inventory-repository.js";

export async function getInventoryByWarehouseIdService(company_id: number, warehouseId: number) {
  const inventoryRepository = new PrismaInventoryRepository();
  
  return await inventoryRepository.getInventoryByWarehouseId(warehouseId, company_id);
}