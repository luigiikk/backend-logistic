import { PrismaPurchaseOrdersItemsRepository } from "@/repositories/prisma-purchase-orders-items-repository.js";

export async function deletePurchaseOrdersItemsService(id: number, company_id: number) {
  const repository = new PrismaPurchaseOrdersItemsRepository();

  return await repository.delete(id, company_id);
}