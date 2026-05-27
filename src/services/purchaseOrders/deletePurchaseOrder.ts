import { PrismaPurchaseOrdersRepository } from "@/repositories/prisma-purchase-orders-repository.js";

export async function deletePurchaseOrderService(id: number, company_id: number) {
  const repository = new PrismaPurchaseOrdersRepository();

  return await repository.delete(id, company_id);
}