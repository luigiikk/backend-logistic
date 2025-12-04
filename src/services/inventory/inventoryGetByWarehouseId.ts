import { PrismaInventoryRepository } from "@/repositories/prisma-inventory-repository.js";

export async function getInventoryByWarehouseIdService(warehouseId: number) {
  const inventoryRepository = new PrismaInventoryRepository();
  
  return await inventoryRepository.getInventoryByWarehouseId(warehouseId);
}