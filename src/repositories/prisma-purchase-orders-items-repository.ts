import { prisma } from "@/lib/prisma.js";

export class PrismaPurchaseOrdersItemsRepository {
  async create(resource_id: number, quantity: number, unit_price: number, purchaseOrdersId: number) {
    
    const total_price = quantity * unit_price;

    const item = await prisma.purchase_order_items.create({
      data: {
        resource_id,
        quantity,
        unit_price,
        total_price,
        purchase_order_id: purchaseOrdersId
      }
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
        }
      })
    }
}