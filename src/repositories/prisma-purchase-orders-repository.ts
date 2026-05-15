import { prisma } from "@/lib/prisma.js";
import { checkCapacity, calcIncomingVolumeByWarehouse } from "@/util/capacityChecker.js";

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
      // 1. Validar capacidade ANTES de qualquer escrita
      const volumeByWarehouse = await calcIncomingVolumeByWarehouse(tx, purchase_orders_items);

      for (const [warehouseId, incomingVolume] of volumeByWarehouse) {
        await checkCapacity({ tx, type: "warehouse", id: warehouseId, incomingVolume });
      }

      // 2. Criar o pedido de compra
      const purchaseOrder = await tx.purchase_orders.create({
        data: {
          supplier_id,
          status_id,
          company_id,
          total_value,
        },
      });

      // 3. Criar os itens com volume persistido
      const itemsWithVolume = await Promise.all(
        purchase_orders_items.map(async (item) => {
          const resource = await tx.resources.findUnique({
            where: { id: item.resource_id },
            select: { width: true, height: true, length: true },
          });

          const unitVolume =
            resource?.width && resource?.height && resource?.length
              ? resource.width * resource.height * resource.length
              : 0;

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

      // 4. Atualizar estoque (apenas inventory)
      for (const item of purchase_orders_items) {
        const { resource_id, warehouse_id, quantity } = item;

        await tx.inventory.upsert({
          where: {
            resource_id_warehouse_id_company_id: { resource_id, warehouse_id, company_id },
          },
          update: { quantity: { increment: quantity } },
          create: { resource_id, warehouse_id, company_id, quantity },
        });
      }

      // 5. Criar invoice
      const invoice = await tx.invoice.create({
        data: {
          issue_date: new Date(),
          company_id,
          purchase_order_id: purchaseOrder.id,
        },
      });

      return { ...purchaseOrder, invoice };
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
      // 1. Validar capacidade ANTES de qualquer escrita
      const volumeByWarehouse = await calcIncomingVolumeByWarehouse(tx, purchase_orders_items);

      for (const [warehouseId, incomingVolume] of volumeByWarehouse) {
        await checkCapacity({
          tx,
          type: "warehouse",
          id: warehouseId,
          incomingVolume,
          excludeOrderId: id,
        });
      }

      // 2. Calcular total e atualizar o pedido
      const total_value = purchase_orders_items.reduce(
        (acc, item) => acc + item.quantity * item.unit_price,
        0
      );

      const updatedOrder = await tx.purchase_orders.update({
        where: { id, company_id },
        data: { supplier_id, status_id, total_value },
      });

      // 3. Buscar itens antigos para reverter o estoque
      const oldItems = await tx.purchase_order_items.findMany({
        where: { purchase_order_id: id, company_id },
      });

      // 4. Reverter inventory com base nos itens antigos
      for (const old of oldItems) {
        await tx.inventory.updateMany({
          where: {
            resource_id: old.resource_id,
            warehouse_id: old.warehouse_id,
            company_id,
          },
          data: { quantity: { decrement: old.quantity ?? 0 } },
        });
      }

      // 5. Deletar itens antigos
      await tx.purchase_order_items.deleteMany({
        where: { purchase_order_id: id, company_id },
      });

      // 6. Criar novos itens com volume persistido
      const itemsWithVolume = await Promise.all(
        purchase_orders_items.map(async (item) => {
          const resource = await tx.resources.findUnique({
            where: { id: item.resource_id },
            select: { width: true, height: true, length: true },
          });

          const unitVolume =
            resource?.width && resource?.height && resource?.length
              ? resource.width * resource.height * resource.length
              : 0;

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

      // 7. Aplicar novos efeitos apenas no inventory
      for (const item of purchase_orders_items) {
        const { resource_id, warehouse_id, quantity } = item;

        await tx.inventory.upsert({
          where: {
            resource_id_warehouse_id_company_id: { resource_id, warehouse_id, company_id },
          },
          update: { quantity: { increment: quantity } },
          create: { resource_id, warehouse_id, company_id, quantity },
        });
      }

      // 8. Atualizar invoice
      const invoice = await tx.invoice.findFirst({
        where: { purchase_order_id: id, company_id },
      });

      const updatedInvoice = invoice
        ? await tx.invoice.update({
            where: { id: invoice.id },
            data: { updated_at: new Date() },
          })
        : null;

      return { ...updatedOrder, invoice: updatedInvoice };
    });
  }

  async getAllPurchaseOrders(company_id: number) {
    return await prisma.purchase_orders.findMany({
      where: { company_id },
      include: {
        supplier: true,
        status: true,
        items: {
          include: {
            resource: {
              include: { category: true },
            },
          },
        },
      },
      orderBy: { created_at: "desc" },
    });
  }

  async getPurchaseOrdersById(id: number, company_id: number) {
    return await prisma.purchase_orders.findFirst({
      where: { id, company_id },
      include: {
        supplier: true,
        status: true,
        items: {
          include: {
            resource: {
              include: { category: true },
            },
            Warehouse: true,
          },
        },
      },
    });
  }
}