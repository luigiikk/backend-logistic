import { PrismaPurchaseOrdersItemsRepository } from "@/repositories/prisma-purchase-orders-items-repository.js";

export async function getAllPurchaseOrdersItemsService(company_id: number) {
  const repository = new PrismaPurchaseOrdersItemsRepository();

  return await repository.getAllPurchaseOrdersItems(company_id);
}