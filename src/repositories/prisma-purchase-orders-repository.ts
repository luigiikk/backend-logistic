import { prisma } from "@/lib/prisma.js";

interface PurchaseOrdersData {
  company_id: number;
  supplier_id: number;
  status_id: number;
  purchase_orders_items: {
    resource_id: number;
    warehouse_id: number;
    quantity: number;
    unit_price: number;
  }[];
}

interface UpdatePurchaseOrderParams {
  id: number;
  company_id: number;
  supplier_id: number;
  status_id: number;
  purchase_orders_items: {
    resource_id: number;
    warehouse_id: number;
    quantity: number;
    unit_price: number;
  }[];
}


export class PrismaPurchaseOrdersRepository {
  async create({
    company_id,
    supplier_id,
    status_id,
    purchase_orders_items,
  }: PurchaseOrdersData) {
    const total_value = purchase_orders_items.reduce(
      (acc, item) => acc + item.quantity * item.unit_price,
      0
    );
  
    return await prisma.$transaction(async (tx) => {
  
      // 1. Create the purchase order
      const purchaseOrder = await tx.purchase_orders.create({
        data: {
          supplier_id,
          status_id,
          company_id,
          total_value,
        },
      });
  
      // 2. Create purchase order items
      await tx.purchase_order_items.createMany({
        data: purchase_orders_items.map((item) => ({
          purchase_order_id: purchaseOrder.id,
          resource_id: item.resource_id,
          warehouse_id: item.warehouse_id, 
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.quantity * item.unit_price,
          company_id,
        })),
      });
  
      // 3. UPDATE STOCK for each item
      for (const item of purchase_orders_items) {
        const { resource_id, warehouse_id, quantity } = item;
  
        //
        // 3.1 Update resource.quantity
        //
        const resource = await tx.resources.findUnique({
          where: { id: resource_id, company_id },
        });
  
        if (!resource) {
          throw new Error("Resource not found");
        }
  
        await tx.resources.update({
          where: { id: resource_id, company_id },
          data: {
            quantity: (resource.quantity ?? 0) + quantity,
          },
        });
  
        //
        // 3.2 Update or create inventory
        //
        let inventory = await tx.inventory.findFirst({
          where: {
            resource_id,
            warehouse_id,
            company_id,
          },
        });
  
        if (!inventory) {
          // create a new inventory record for this warehouse
          inventory = await tx.inventory.create({
            data: {
              resource_id,
              warehouse_id,
              company_id,
              quantity: 0,
            },
          });
        }
  
        await tx.inventory.update({
          where: { id: inventory.id },
          data: {
            quantity: (inventory.quantity ?? 0) + quantity,
          },
        });
      }
  
      // 4. Create invoice
      const invoice = await tx.invoice.create({
        data: {
          issue_date: new Date(),
          company_id,
          purchase_order_id: purchaseOrder.id,
        },
      });
  
      return {
        ...purchaseOrder,
        invoice,
      };
    });
  }
  

  async update({
    id,
    company_id,
    supplier_id,
    status_id,
    purchase_orders_items,
  }: UpdatePurchaseOrderParams) {
    return await prisma.$transaction(async (tx) => {
  
      // 1. Calcular o total
      const total_value = purchase_orders_items.reduce(
        (acc, item) => acc + item.quantity * item.unit_price,
        0
      );
  
      // 2. Atualizar a purchase order
      const updatedOrder = await tx.purchase_orders.update({
        where: { id, company_id },
        data: { supplier_id, status_id, total_value },
      });
  
      // 3. Buscar items antigos para reverter o estoque
      const oldItems = await tx.purchase_order_items.findMany({
        where: { purchase_order_id: id, company_id },
      });
  
      // 4. Reverter efeitos no RESOURCE e INVENTORY
      for (const old of oldItems) {
        // 4.1 Reverter RESOURCE.quantity
        await tx.resources.update({
          where: { id: old.resource_id },
          data: {
            quantity: { decrement: (old.quantity ?? 0) }, // pois ao criar aumentou
          },
        });
  
        // 4.2 Reverter INVENTORY.quantity
        await tx.inventory.updateMany({
          where: {
            resource_id: old.resource_id,
            warehouse_id: old.warehouse_id,
            company_id,
          },
          data: {
            quantity: { decrement: (old.quantity ?? 0) },
          },
        });
      }
  
      // 5. Deletar items antigos
      await tx.purchase_order_items.deleteMany({
        where: { purchase_order_id: id, company_id },
      });
  
      // 6. Criar novos items
      await tx.purchase_order_items.createMany({
        data: purchase_orders_items.map((item) => ({
          purchase_order_id: id,
          resource_id: item.resource_id,
          warehouse_id: item.warehouse_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.quantity * item.unit_price,
          company_id,
        })),
      });
  
      // 7. Aplicar NOVOS efeitos no estoque
      for (const item of purchase_orders_items) {
        // 7.1 Atualizar RESOURCE.quantity
        await tx.resources.update({
          where: { id: item.resource_id },
          data: {
            quantity: { increment: item.quantity },
          },
        });
  
        // 7.2 Atualizar INVENTORY.quantity por warehouse
        await tx.inventory.upsert({
          where: {
            resource_id_warehouse_id_company_id: {
              resource_id: item.resource_id,
              warehouse_id: item.warehouse_id,
              company_id,
            },
          },
          update: {
            quantity: { increment: item.quantity },
          },
          create: {
            resource_id: item.resource_id,
            warehouse_id: item.warehouse_id,
            company_id,
            quantity: item.quantity,
          },
        });
      }
  
      // 8. Atualizar invoice
      const invoice = await tx.invoice.findFirst({
        where: {
          purchase_order_id: id,
          company_id,
        },
      });
  
      let updatedInvoice = null;
  
      if (invoice) {
        updatedInvoice = await tx.invoice.update({
          where: { id: invoice.id },
          data: { updated_at: new Date() },
        });
      }
  
      return {
        ...updatedOrder,
        invoice: updatedInvoice,
      };
    });
  }

  async getAllPurchaseOrders(company_id: number) {
  return await prisma.purchase_orders.findMany({
      where: {
        company_id,
      },
      include: {
        supplier: true
      }
    })
  }

  async getPurchaseOrdersById(id: number, company_id: number) {
    return await prisma.purchase_orders.findFirst({
      where: {
        id,
        company_id,
      },
      include: {
        items: true,
        supplier: true,
      }
    });
  }
}
