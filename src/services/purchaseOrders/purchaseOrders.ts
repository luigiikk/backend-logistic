import { PrismaPurchaseOrdersRepository } from "@/repositories/prisma-purchase-orders-repository.js";

interface PurchaseOrdersParams {
  supplier_id: number;
  status_id: number;
}

export async function purchaseOrdersService({
  supplier_id,
  status_id,
}: PurchaseOrdersParams) {
  const repository = new PrismaPurchaseOrdersRepository();

  const purchaseOrder = await repository.create(supplier_id, status_id);

  return purchaseOrder;
}