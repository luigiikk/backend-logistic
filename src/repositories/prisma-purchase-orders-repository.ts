import { prisma } from "@/lib/prisma.js";
import { checkCapacity, calcIncomingVolumeByWarehouse } from "@/util/capacityChecker.js";
import { generateInvoiceNumber } from "@/util/generateInvoiceNumber.js";

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
  async create({ company_id, supplier_id, status_id, purchase_orders_items }: PurchaseOrdersData) {
    return await prisma.$transaction(async (tx) => {
      const volumeByWarehouse = await calcIncomingVolumeByWarehouse(tx, purchase_orders_items);
      for (const [warehouseId, incomingVolume] of volumeByWarehouse) {
        await checkCapacity({ tx, type: "warehouse", id: warehouseId, incomingVolume });
      }

      const total_value = purchase_orders_items.reduce((acc, item) => acc + item.quantity * item.unit_price, 0);

      const purchaseOrder = await tx.purchase_orders.create({
        data: { supplier_id, status_id, company_id, total_value },
      });

      const itemsWithVolume = await Promise.all(
        purchase_orders_items.map(async (item) => {
          const resource = await tx.resources.findUnique({
            where: { id: item.resource_id },
            select: { width: true, height: true, length: true },
          });

          const unitVolume = resource?.width && resource?.height && resource?.length
            ? resource.width * resource.height * resource.length : 0;

          return {
            purchase_order_id: purchaseOrder.id,
            resource_id: item.resource_id,
            warehouse_id: item.warehouse_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: item.quantity * item.unit_price,
            volume: unitVolume * item.quantity,
            company_id,
          };
        })
      );

      await tx.purchase_order_items.createMany({ data: itemsWithVolume });

      for (const item of purchase_orders_items) {
        await tx.inventory.upsert({
          where: { resource_id_warehouse_id_company_id: { resource_id: item.resource_id, warehouse_id: item.warehouse_id, company_id } },
          update: { quantity: { increment: item.quantity } },
          create: { resource_id: item.resource_id, warehouse_id: item.warehouse_id, company_id, quantity: item.quantity },
        });
      }

      const invoiceNumber = await generateInvoiceNumber();
      const invoice = await tx.invoice.create({
        data: { 
          invoice_number: invoiceNumber,
          issue_date: new Date(), 
          company_id, 
          purchase_order_id: purchaseOrder.id 
        },
      });

      return { 
        ...purchaseOrder, 
        code: `PC-${String(purchaseOrder.id).padStart(5, "0")}`,
        invoice 
      };
    });
  }

  async update({ id, company_id, supplier_id, status_id, purchase_orders_items }: UpdatePurchaseOrderParams) {
    return await prisma.$transaction(async (tx) => {
      const volumeByWarehouse = await calcIncomingVolumeByWarehouse(tx, purchase_orders_items);
      for (const [warehouseId, incomingVolume] of volumeByWarehouse) {
        await checkCapacity({ tx, type: "warehouse", id: warehouseId, incomingVolume, excludeOrderId: id });
      }

      const total_value = purchase_orders_items.reduce((acc, item) => acc + item.quantity * item.unit_price, 0);

      const updatedOrder = await tx.purchase_orders.update({
        where: { id, company_id },
        data: { supplier_id, status_id, total_value },
      });

      const oldItems = await tx.purchase_order_items.findMany({
        where: { purchase_order_id: id, company_id },
      });

      for (const old of oldItems) {
        await tx.inventory.updateMany({
          where: { resource_id: old.resource_id, warehouse_id: old.warehouse_id, company_id },
          data: { quantity: { decrement: old.quantity ?? 0 } },
        });
      }

      await tx.purchase_order_items.deleteMany({ where: { purchase_order_id: id, company_id } });

      const itemsWithVolume = await Promise.all(
        purchase_orders_items.map(async (item) => {
          const resource = await tx.resources.findUnique({
            where: { id: item.resource_id },
            select: { width: true, height: true, length: true },
          });

          const unitVolume = resource?.width && resource?.height && resource?.length
            ? resource.width * resource.height * resource.length : 0;

          return {
            purchase_order_id: id,
            resource_id: item.resource_id,
            warehouse_id: item.warehouse_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: item.quantity * item.unit_price,
            volume: unitVolume * item.quantity,
            company_id,
          };
        })
      );

      await tx.purchase_order_items.createMany({ data: itemsWithVolume });

      for (const item of purchase_orders_items) {
        await tx.inventory.upsert({
          where: { resource_id_warehouse_id_company_id: { resource_id: item.resource_id, warehouse_id: item.warehouse_id, company_id } },
          update: { quantity: { increment: item.quantity } },
          create: { resource_id: item.resource_id, warehouse_id: item.warehouse_id, company_id, quantity: item.quantity },
        });
      }

      const invoice = await tx.invoice.findFirst({ where: { purchase_order_id: id, company_id } });
      const updatedInvoice = invoice
        ? await tx.invoice.update({ where: { id: invoice.id }, data: { updated_at: new Date() } })
        : null;

      return { 
        ...updatedOrder, 
        code: `PC-${String(updatedOrder.id).padStart(5, "0")}`,
        invoice: updatedInvoice 
      };
    });
  }

  async getAllPurchaseOrders(company_id: number) {
    const orders = await prisma.purchase_orders.findMany({
      where: { company_id },
      include: {
        supplier: true,
        status: true,
        items: { include: { resource: { include: { category: true } } } },
      },
      orderBy: { created_at: "desc" },
    });

    return orders.map((o) => ({
      ...o,
      code: `PC-${String(o.id).padStart(5, "0")}`,
    }));
  }

  async getPurchaseOrdersById(id: number, company_id: number) {
    const order = await prisma.purchase_orders.findFirst({
      where: { id, company_id },
      include: {
        supplier: true,
        status: true,
        items: { include: { resource: { include: { category: true } }, Warehouse: true } },
      },
    });

    if (!order) return null;
    return {
      ...order,
      code: `PC-${String(order.id).padStart(5, "0")}`,
    };
  }

  async delete(id: number, company_id: number) {
    return await prisma.$transaction(async (tx) => {
      const order = await tx.purchase_orders.findUnique({
        where: { id, company_id },
        include: { items: true },
      });

      if (!order) throw new Error("Purchase order not found");

      // 1. Reverter inventory de cada item
      for (const item of order.items) {
        const inventory = await tx.inventory.findFirst({
          where: { resource_id: item.resource_id, warehouse_id: item.warehouse_id, company_id },
        });

        if (inventory) {
          await tx.inventory.update({
            where: { id: inventory.id },
            data: { quantity: { decrement: item.quantity ?? 0 } },
          });
        }
      }

      // 2. Deletar itens, invoice e pedido
      await tx.purchase_order_items.deleteMany({ where: { purchase_order_id: id, company_id } });
      await tx.invoice.deleteMany({ where: { purchase_order_id: id, company_id } });
      await tx.purchase_orders.delete({ where: { id } });
    });
  }
}