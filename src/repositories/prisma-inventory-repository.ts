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
}
