import { PrismaPurchaseOrdersRepository } from "@/repositories/prisma-purchase-orders-repository.js";


export async function getAllPurchaseOrdersService(
  company_id: number,
) {
  const repository = new PrismaPurchaseOrdersRepository();

  return await repository.getAllPurchaseOrders(company_id);
}