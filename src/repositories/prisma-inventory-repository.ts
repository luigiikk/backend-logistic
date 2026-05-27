import { prisma } from "@/lib/prisma.js";

export class PrismaInventoryRepository {
  async addStock(company_id: number, resource_id: number, warehouse_id: number, quantity: number) {
    return await prisma.inventory.upsert({
      where: {
        resource_id_warehouse_id_company_id: {
          resource_id,
          warehouse_id,
          company_id,
        },
      },
      update: {
        quantity: { increment: quantity },
      },
      create: {
        resource_id,
        warehouse_id,
        company_id,
        quantity,
      },
    });
  }

  async removeStock(company_id: number, resource_id: number, warehouse_id: number, quantity: number) {
    return await prisma.$transaction(async (tx) => {
      const inventory = await tx.inventory.findUnique({
        where: {
          resource_id_warehouse_id_company_id: {
            resource_id,
            warehouse_id,
            company_id,
          },
        },
      });

      if (!inventory) throw new Error("Inventory not found.");
      if ((inventory.quantity ?? 0) < quantity) {
        throw new Error("Not enough quantity in inventory.");
      }

      return await tx.inventory.update({
        where: { id: inventory.id },
        data: {
          quantity: { decrement: quantity },
        },
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
      const originInventory = await tx.inventory.findFirst({
        where: { id: inventoryId, company_id },
      });

      if (!originInventory) throw new Error("Inventory not found.");
      if ((originInventory.quantity ?? 0) < quantity) {
        throw new Error("Not enough quantity to transfer.");
      }

      await tx.inventory.update({
        where: { id: inventoryId },
        data: {
          quantity: { decrement: quantity },
        },
      });

      return await tx.inventory.upsert({
        where: {
          resource_id_warehouse_id_company_id: {
            resource_id: originInventory.resource_id,
            warehouse_id: newWarehouseId,
            company_id,
          },
        },
        update: {
          quantity: { increment: quantity },
        },
        create: {
          resource_id: originInventory.resource_id,
          warehouse_id: newWarehouseId,
          company_id,
          quantity,
        },
      });
    });
  }

  async getInventoryById(company_id: number, id: number) {
    return await prisma.inventory.findFirst({
      where: { company_id, id },
      include: { resource: true, warehouse: true },
    });
  }

  async getAllInventory(company_id: number) {
    return await prisma.inventory.findMany({
      where: { company_id },
      include: {
        resource: { include: { category: true } },
        warehouse: true,
      },
    });
  }

  async getInventoryByWarehouseId(warehouseId: number, company_id: number) {
    const inventory = await prisma.inventory.findMany({
      where: { warehouse_id: warehouseId, company_id },
      include: { resource: true, warehouse: true },
    });

    return inventory.map((item) => ({
      id: item.id,
      resource_name: item.resource.name,
      warehouse_name: item.warehouse?.name ?? "Unknown",
      quantity: item.quantity ?? 0,
    }));
  }
}