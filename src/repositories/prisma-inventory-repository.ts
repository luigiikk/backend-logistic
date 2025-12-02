import { prisma } from "@/lib/prisma.js";

export class PrismaInventoryRepository {

  async findByResourceAndWarehouse(resourceId: number, warehouseId: number) {
    const inventory = await prisma.inventory.findFirst({
      where: {
        resource_id: resourceId,
        warehouse_id: warehouseId
      }
    });

    return inventory;
  }

  async createOrIncrement(resourceId: number, warehouseId: number, quantity: number) {
    const existingInventory = await this.findByResourceAndWarehouse(resourceId, warehouseId);

    if (existingInventory) {
      const updated = await prisma.inventory.update({
        where: { id: existingInventory.id },
        data: {
          quantity: (existingInventory.quantity ?? 0) + quantity
        }
      });

      return updated;
    }

    const created = await prisma.inventory.create({
      data: {
        resource: { connect: { id: resourceId } },
        warehouse: { connect: { id: warehouseId } },
        quantity
      }
    });

    return created;
  }

  async incrementQuantity(id: number, quantity: number) {
    const updated = await prisma.inventory.update({
      where: { id },
      data: {
        quantity: {
          increment: quantity
        }
      }
    });

    return updated;
  }

  async setQuantity(id: number, quantity: number) {
    return prisma.inventory.update({
      where: { id },
      data: { quantity }
    });
  }

  async decrementQuantity(resourceId: number, warehouseId: number, quantity: number) {

    const existingInventory = await this.findByResourceAndWarehouse(resourceId, warehouseId);

    if(!existingInventory){
      throw new Error();
    }

    return prisma.inventory.update({
      where: { id: existingInventory.id },
      data: {
        quantity: {
          decrement: quantity
        }
      }
    });
  }

  async moveInventory(inventoryId: number, newWarehouseId: number, quantity: number) {
   return await prisma.$transaction(async (prisma) => {
    const originInventory = await prisma.inventory.findUnique({
      where: {id: inventoryId }
    });

    if(!originInventory) {
      throw new Error("inventory not found");
    }

    if((originInventory.quantity === null) || originInventory.quantity < quantity){
      throw new Error("Not enough quantity to transfer");
    }

    await prisma.inventory.update({
      where: { id: inventoryId },
      data: {
        quantity: originInventory.quantity - quantity,
      },
    });

    let destinyInventory = await prisma.inventory.findFirst({
      where: {
        resource_id: originInventory.resource_id,
        warehouse_id: newWarehouseId,
      },
    });

    if (!destinyInventory) {
      destinyInventory = await prisma.inventory.create({
        data: {
          resource_id: originInventory.resource_id,
          warehouse_id: newWarehouseId,
          quantity: quantity,
        },
      });
    } else {
      destinyInventory = await prisma.inventory.update({
        where: { id: destinyInventory.id },
        data: {
          quantity: (destinyInventory.quantity ?? 0) + quantity,
        },
      });
    }

    return destinyInventory;

   })
  }

  async getInventoryByResourceId(resourceId: number) {
    const inventory = await prisma.inventory.findMany({
      where: { resource_id: resourceId },
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

  async getInventoryByWarehouseId(warehouseId: number) {
    const inventory = await prisma.inventory.findMany({
      where: { warehouse_id: warehouseId },
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
