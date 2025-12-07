import { PrismaPurchaseOrdersRepository } from "@/repositories/prisma-purchase-orders-repository.js";


export async function getPurchaseOrdersByIdService(
  id: number,
  company_id: number,
) {
  const repository = new PrismaPurchaseOrdersRepository();

  return await repository.getPurchaseOrdersById(id, company_id);
}