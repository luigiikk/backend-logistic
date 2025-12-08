import { PrismaInventoryRepository } from "@/repositories/prisma-inventory-repository.js";

export async function getInventoryByIdService(company_id: number, id: number) {
  const inventoryRepository = new PrismaInventoryRepository();
  
  return await inventoryRepository.getInventoryById(company_id, id);
}