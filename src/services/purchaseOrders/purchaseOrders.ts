import { PrismaPurchaseOrdersRepository } from "@/repositories/prisma-purchase-orders-repository.js";
import { PrismaStatusRepository } from "@/repositories/prisma-status-repository.js";

interface PurchaseOrdersParams {
  supplier_id: number;
  status_id?: number;
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

  let resolvedStatusId = status_id;

if (!resolvedStatusId) {
  const prismaStatusRepository = new PrismaStatusRepository();

  const status =
    (await prismaStatusRepository.getDefault(company_id, "purchase_order")) ??
    (await prismaStatusRepository.getSystemDefault("purchase_order"));

  if (!status) {
    throw new Error("No purchase_order status found.");
  }

  resolvedStatusId = status.id;
}

  return await repository.create({
    company_id,
    supplier_id,
    status_id: resolvedStatusId,
    purchase_orders_items,
  });
}