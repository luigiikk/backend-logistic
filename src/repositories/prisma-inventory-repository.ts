import { prisma } from "@/lib/prisma.js";

export class PrismaInventoryRepository {

  async findByResourceAndWarehouse(resourceId: number, warehouseId: number, company_id: number) {
    const inventory = await prisma.inventory.findFirst({
      where: {
        resource_id: resourceId,
        warehouse_id: warehouseId,
        company_id,
      }
    });

    return inventory;
  }

  async createOrIncrement(
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
  
      let inventoryRecord;
  
      if (existingInventory) {
        // Atualiza inventory existente
        inventoryRecord = await tx.inventory.update({
          where: { id: existingInventory.id },
          data: {
            quantity: (existingInventory.quantity ?? 0) + quantity,
          },
        });
      } else {
        // Cria novo registro de inventário
        inventoryRecord = await tx.inventory.create({
          data: {
            resource_id: resourceId,
            warehouse_id: warehouseId,
            company_id,
            quantity,
          },
        });
      }
  
      // Sempre atualizar a quantidade total de recursos
      await tx.resources.update({
        where: { id: resourceId, company_id },
        data: {
          quantity: { increment: quantity },
        },
      });
  
      return inventoryRecord;
    });
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
  
      // Atualiza Inventory
      const updatedInventory = await tx.inventory.update({
        where: { id: existingInventory.id },
        data: {
          quantity: {
            decrement: quantity,
          },
        },
      });
  
      // Atualiza Resources também
      await tx.resources.update({
        where: { id: resourceId, company_id },
        data: {
          quantity: { decrement: quantity },
        },
      });
  
      return updatedInventory;
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
