import { prisma } from "@/lib/prisma.js";

export class PrismaPurchaseOrdersItemsRepository {
  async getAllPurchaseOrdersItems(company_id: number) {
    return await prisma.purchase_order_items.findMany({
      where: { company_id },
      include: { resource: true },
    });
  }

  async getPurchaseOrdersItemsById(id: number, company_id: number) {
    return await prisma.purchase_order_items.findUnique({
      where: { id, company_id },
      include: { resource: true },
    });
  }

  async delete(id: number, company_id: number) {
    return await prisma.$transaction(async (tx) => {
      const item = await tx.purchase_order_items.findUnique({
        where: { id, company_id },
      });

      if (!item) throw new Error("Purchase order item not found");

      // 1. Deletar o item
      await tx.purchase_order_items.delete({ where: { id } });

      // 2. Devolver quantidade ao inventory
      const inventory = await tx.inventory.findFirst({
        where: { resource_id: item.resource_id, warehouse_id: item.warehouse_id, company_id },
      });

      if (inventory) {
        await tx.inventory.update({
          where: { id: inventory.id },
          data: { quantity: { decrement: item.quantity ?? 0 } },
        });
      }

      // 3. Verificar se era o único item do pedido
      const remainingItems = await tx.purchase_order_items.findMany({
        where: { purchase_order_id: item.purchase_order_id, company_id },
      });

      if (remainingItems.length === 0) {
        // Deletar invoice e pedido
        await tx.invoice.deleteMany({ where: { purchase_order_id: item.purchase_order_id } });
        await tx.purchase_orders.delete({ where: { id: item.purchase_order_id } });
      } else {
        // Recalcular total do pedido
        await tx.purchase_orders.update({
          where: { id: item.purchase_order_id, company_id },
          data: {
            total_value: remainingItems.reduce((acc, i) => acc + (i.total_price ?? 0), 0),
          },
        });
      }
    });
  }
}