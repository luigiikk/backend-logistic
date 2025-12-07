import { prisma } from "@/lib/prisma.js";

export class PrismaPurchaseOrdersItemsRepository {
  async create(
    resource_id: number,
    quantity: number,
    unit_price: number,
    purchaseOrdersId: number
  ) {
    const total_price = quantity * unit_price;

    const item = await prisma.purchase_order_items.create({
      data: {
        resource_id,
        quantity,
        unit_price,
        total_price,
        purchase_order_id: purchaseOrdersId,
      },
    });

    return item;
  }

  async getAllPurchaseOrdersItems(company_id: number) {
    return await prisma.purchase_order_items.findMany({
      where: {
        company_id,
      },
      include: {
        resource: true,
      },
    });
  }

  async getPurchaseOrdersItemsById(id: number, company_id: number) {
    return await prisma.purchase_order_items.findUnique({
      where: {
        id,
        company_id,
      },
      include: {
        resource: true,
      },
    });
  }

  async update(
    id: number,
    company_id: number,
    purchase_order_id: number,
    resource_id: number,
    quantity: number,
    unit_price: number
  ) {
    return await prisma.$transaction(async (tx) => {
      const existingItem = await tx.purchase_order_items.findUnique({
        where: { id, company_id },
      });
  
      if (!existingItem) {
        throw new Error("Purchase order item not found");
      }
  
      const oldOrderId = existingItem.purchase_order_id; 
      const newOrderId = purchase_order_id; 
      const newTotalPrice = quantity * unit_price;
  
  
      const updatedItem = await tx.purchase_order_items.update({
        where: { id, company_id },
        data: {
          purchase_order_id: newOrderId,
          resource_id,
          quantity,
          unit_price,
          total_price: newTotalPrice,
        },
      });
  
      if (oldOrderId !== newOrderId) {
        const oldOrderItems = await tx.purchase_order_items.findMany({
          where: { purchase_order_id: oldOrderId, company_id },
        });
  
        const oldOrderTotal = oldOrderItems.reduce(
          (acc, item) => acc + (item.total_price ?? 0),
          0
        );
  
        await tx.purchase_orders.update({
          where: { id: oldOrderId, company_id },
          data: { total_value: oldOrderTotal },
        });
      }
  
 
      const newOrderItems = await tx.purchase_order_items.findMany({
        where: { purchase_order_id: newOrderId, company_id },
      });
  
      const newOrderTotal = newOrderItems.reduce(
        (acc, item) => acc + (item.total_price ?? 0),
        0
      );
  
      await tx.purchase_orders.update({
        where: { id: newOrderId, company_id },
        data: { total_value: newOrderTotal },
      });
  
      return updatedItem;
    });
  }
}
