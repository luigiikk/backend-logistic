import { PrismaPurchaseOrdersItemsRepository } from "@/repositories/prisma-purchase-orders-items-repository.js";



export async function updatePurchaseOrdersItemsService(
  id: number,
  company_id: number,
  purchase_order_id: number,
  resource_id: number,
  quantity: number,
  unit_price: number,
  warehouse_id: number
) {
  const repository = new PrismaPurchaseOrdersItemsRepository();

  return await repository.update(id, company_id, purchase_order_id, resource_id, quantity, unit_price, warehouse_id);
}