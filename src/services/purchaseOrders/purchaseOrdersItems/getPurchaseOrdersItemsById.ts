import { PrismaPurchaseOrdersItemsRepository } from "@/repositories/prisma-purchase-orders-items-repository.js";


export async function getPurchaseOrdersItemsByIdService(
  id: number,
  company_id: number,
) {
  const repository = new PrismaPurchaseOrdersItemsRepository();

  return await repository.getPurchaseOrdersItemsById(id, company_id);
}