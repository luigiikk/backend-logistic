import { PrismaInventoryRepository } from "@/repositories/prisma-inventory-repository.js";

interface InventoryBodySchema {
  id: number;
  warehouse_id: number,
  quantity: number
}

export async function transferInventoryService(company_id: number, {
  id,
  warehouse_id,
  quantity,
}: InventoryBodySchema) {

  const inventoryRepository = new PrismaInventoryRepository();

  const inventory = await inventoryRepository.moveInventory(company_id, id, warehouse_id, quantity );

  return inventory;
}
