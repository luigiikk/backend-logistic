import { PrismaInventoryRepository } from "@/repositories/prisma-inventory-repository.js";

export async function getAllInventoryService(company_id: number) {
  const inventoryRepository = new PrismaInventoryRepository();
  
  return await inventoryRepository.getAllInventory(company_id);
}