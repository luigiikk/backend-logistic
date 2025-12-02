import { prisma } from "@/lib/prisma.js";

export class PrismaPurchaseOrdersRepository {
  async create(supplier_id: number, status_id: number) {
    const purchaseOrder = await prisma.purchase_orders.create({
      data: {
        supplier_id,
        status_id,
        total_value: 0 
      },
    });

    return purchaseOrder;
  }
}