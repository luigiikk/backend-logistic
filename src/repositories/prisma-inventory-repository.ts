import { prisma } from "@/lib/prisma.js";

export class PrismaInventoryRepository {

  async addStock(company_id: number, resource_id: number, warehouse_id: number, quantity: number) {
  return await prisma.inventory.upsert({
    where: {
      resource_id_warehouse_id_company_id: { resource_id, warehouse_id, company_id },
    },
    update: { quantity: { increment: quantity } },
    create: { resource_id, warehouse_id, company_id, quantity },
  });
}

  async findByResourceAndWarehouse(resourceId: number, warehouseId: number, company_id: number) {
    return await prisma.inventory.findFirst({
      where: {
        resource_id: resourceId,
        warehouse_id: warehouseId,
        company_id,
      },
    });
  }

  async decrementQuantity(
    company_id: number,
    resourceId: number,
    warehouseId: number,
    quantity: number
  ) {
    return await prisma.$transaction(async (tx) => {
      const existingInventory = await tx.inventory.findFirst({
        where: {
          resource_id: resourceId,
          warehouse_id: warehouseId,
          company_id,
        },
      });

      if (!existingInventory) {
        throw new Error("Inventory record not found.");
      }

      if ((existingInventory.quantity ?? 0) < quantity) {
        throw new Error("Not enough inventory to decrement.");
      }

      return tx.inventory.update({
        where: { id: existingInventory.id },
        data: { quantity: { decrement: quantity } },
      });
    });
  }

  async moveInventory(
    company_id: number,
    inventoryId: number,
    newWarehouseId: number,
    quantity: number
  ) {
    return await prisma.$transaction(async (tx) => {
      const originInventory = await tx.inventory.findUnique({
        where: { id: inventoryId, company_id },
      });

      if (!originInventory) {
        throw new Error("Inventory not found.");
      }

      if ((originInventory.quantity ?? 0) < quantity) {
        throw new Error("Not enough quantity to transfer.");
      }

      await tx.inventory.update({
        where: { id: inventoryId },
        data: { quantity: { decrement: quantity } },
      });

      const destinyInventory = await tx.inventory.findFirst({
        where: {
          resource_id: originInventory.resource_id,
          warehouse_id: newWarehouseId,
          company_id,
        },
      });

      if (!destinyInventory) {
        return tx.inventory.create({
          data: {
            resource_id: originInventory.resource_id,
            warehouse_id: newWarehouseId,
            company_id,
            quantity,
          },
        });
      }

      return tx.inventory.update({
        where: { id: destinyInventory.id },
        data: { quantity: { increment: quantity } },
      });
    });
  }

  async getInventoryById(company_id: number, id: number) {
    return await prisma.inventory.findFirst({
      where: { company_id, id },
      include: {
        resource: true,
        warehouse: true,
      },
    });
  }

  async getAllInventory(company_id: number) {
  return await prisma.inventory.findMany({
    where: { company_id },
    include: {
      resource: {
        include: { category: true },
      },
      warehouse: true,
    },
  });
}

  async getInventoryByWarehouseId(warehouseId: number, company_id: number) {
    const inventory = await prisma.inventory.findMany({
      where: { warehouse_id: warehouseId, company_id },
      include: {
        resource: true,
        warehouse: true,
      },
    });

    return inventory.map((item) => ({
      id: item.id,
      resource_name: item.resource.name,
      warehouse_name: item.warehouse?.name ?? "Unknown",
      quantity: item.quantity ?? 0,
    }));
  }
}