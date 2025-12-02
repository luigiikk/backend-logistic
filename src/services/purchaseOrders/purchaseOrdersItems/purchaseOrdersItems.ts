import { prisma } from "@/lib/prisma.js";
import { PrismaPurchaseOrdersItemsRepository } from "@/repositories/prisma-purchase-orders-items-repository.js";

interface PurchaseOrdersItemsParams {
  resource_id: number;
  quantity: number;
  unit_price: number;
  purchaseOrdersId: number;
}

export async function purchaseOrdersItemsService({
  resource_id,
  quantity,
  unit_price,
  purchaseOrdersId
}: PurchaseOrdersItemsParams) {
  
  return await prisma.$transaction(async (prisma) => {
    const itemsRepo = new PrismaPurchaseOrdersItemsRepository();

    const item = await itemsRepo.create(
      resource_id,
      quantity,
      unit_price,
      purchaseOrdersId
    );

    const result = await prisma.purchase_order_items.aggregate({
      where: { purchase_order_id: purchaseOrdersId },
      _sum: {
        total_price: true
      }
    });

    const newTotalValue = result._sum.total_price ?? 0;

    await prisma.purchase_orders.update({
      where: { id: purchaseOrdersId },
      data: { total_value: newTotalValue }
    });

    return item;
  });
}