import { PrismaInventoryRepository } from "@/repositories/prisma-inventory-repository.js";

export async function getInventoryByResourceIdService(resourceId: number) {
  const inventoryRepository = new PrismaInventoryRepository();
  
  return await inventoryRepository.getInventoryByResourceId(resourceId);
}