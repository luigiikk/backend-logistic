import { PrismaPurchaseOrdersRepository } from "@/repositories/prisma-purchase-orders-repository.js";

interface PurchaseOrdersParams {
  supplier_id: number;
  status_id: number;
  purchase_orders_items: {
    resource_id: number;
    warehouse_id: number,
    quantity: number;
    unit_price: number;
  }[];
}

export async function purchaseOrdersService(
  company_id: number,
  { supplier_id, status_id, purchase_orders_items }: PurchaseOrdersParams
) {
  const repository = new PrismaPurchaseOrdersRepository();

  return await repository.create({
    company_id,
    supplier_id,
    status_id,
    purchase_orders_items,
  });
}