import { PrismaInventoryRepository } from "@/repositories/prisma-inventory-repository.js";

interface InventoryBodySchema {
  resource_id: number;
  warehouse_id: number,
  quantity: number,
}

export async function registerInventoryService(company_id: number, {
  resource_id,
  warehouse_id,
  quantity,
}: InventoryBodySchema) {

  const inventoryRepository = new PrismaInventoryRepository();

  const inventory = await inventoryRepository.moveInventory(company_id, resource_id, warehouse_id, quantity);

  return inventory;
}
