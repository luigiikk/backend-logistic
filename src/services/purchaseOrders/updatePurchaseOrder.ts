import { PrismaPurchaseOrdersRepository } from "@/repositories/prisma-purchase-orders-repository.js";

export interface PurchaseOrdersUpdateParams {
  supplier_id: number;
  status_id: number;
  purchase_orders_items: {
    id?: number;
    resource_id: number;
    quantity: number;
    unit_price: number;
  }[];
}

export async function updatePurchaseOrdersService(
  id: number,
  company_id: number,
  data: PurchaseOrdersUpdateParams
) {
  const repository = new PrismaPurchaseOrdersRepository();

  return await repository.update({
    id,
    company_id,
    ...data,
  });
}