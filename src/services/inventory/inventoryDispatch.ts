import { warehousesRegister } from "@/http/controllers/warehouses/registerWarehouses.js";
import { prisma } from "@/lib/prisma.js";
import { PrismaInventoryRepository } from "@/repositories/prisma-inventory-repository.js";
import { PrismaResourceRepository } from "@/repositories/prisma-resource-repository.js";

interface InventoryBodySchema {
  resource_id: number;
  warehouse_id: number,
  quantity: number,
}

export async function dispatchInventoryService(company_id: number, {
  resource_id,
  warehouse_id,
  quantity,
}: InventoryBodySchema) {

  const inventoryRepository = new PrismaInventoryRepository();

  const inventory = await inventoryRepository.decrementQuantity(company_id, resource_id, warehouse_id, quantity);

  return inventory;
}
