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
    unit_price: number,
    warehouse_id: number
  ) {
    return await prisma.$transaction(async (tx) => {
      // 1. Buscar item antigo
      const existingItem = await tx.purchase_order_items.findUnique({
        where: { id, company_id },
      });
  
      if (!existingItem) {
        throw new Error("Purchase order item not found");
      }
  
      const oldResource = existingItem.resource_id;
      const oldWarehouse = existingItem.warehouse_id;
      const oldQuantity = existingItem.quantity;
      const oldOrderId = existingItem.purchase_order_id;
  
      const newOrderId = purchase_order_id;
      const newTotalPrice = quantity * unit_price;
  
      // ------------------------------------------------------------------
      // 2. REVERTER IMPACTO DO ITEM ANTIGO (estoque, resource, inventory)
      // ------------------------------------------------------------------
  
      // 2.1 Voltar quantidade do Resources antigo
      await tx.resources.update({
        where: { id: oldResource, company_id },
        data: { quantity: { decrement: (oldQuantity ?? 0) } },
      });
  
      // 2.2 Voltar quantidade no Inventory antigo
      await tx.inventory.upsert({
        where: {
          resource_id_warehouse_id_company_id: {
            resource_id: oldResource,
            warehouse_id: oldWarehouse,
            company_id,
          },
        },
        update: {
          quantity: { decrement: (oldQuantity ?? 0) },
        },
        create: {
          resource_id: oldResource,
          warehouse_id: oldWarehouse,
          company_id,
          quantity: 0 - (oldQuantity ?? 0 ),
        },
      });
  
      // ------------------------------------------------------------------
      // 3. ATUALIZAR O ITEM COM OS NOVOS VALORES
      // ------------------------------------------------------------------
  
      const updatedItem = await tx.purchase_order_items.update({
        where: { id, company_id },
        data: {
          purchase_order_id: newOrderId,
          resource_id,
          quantity,
          unit_price,
          total_price: newTotalPrice,
          warehouse_id,
        },
      });
  
      // ------------------------------------------------------------------
      // 4. APLICAR IMPACTO DOS NOVOS VALORES (resource + inventory)
      // ------------------------------------------------------------------
  
      // 4.1 Atualizar resource novo
      await tx.resources.update({
        where: { id: resource_id, company_id },
        data: { quantity: { increment: quantity } },
      });
  
      // 4.2 Atualizar inventory novo
      await tx.inventory.upsert({
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
  
      // ------------------------------------------------------------------
      // 5. RE-CALCULAR TOTAL DOS PURCHASE ORDERS ENVOLVIDOS
      // ------------------------------------------------------------------
  
      // 5.1 Recalcular order antiga se mudou de order
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
  
      // 5.2 Recalcular order nova
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
