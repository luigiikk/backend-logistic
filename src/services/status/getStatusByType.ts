import { PrismaStatusRepository } from "@/repositories/prisma-status-repository.js";

export async function getStatusByTypeService(company_id: number, type: "vehicle" | "order" | "invoice" | "purchase_order") {
  const prismaStatusRepository = new PrismaStatusRepository();

  const statuses = await prismaStatusRepository.getStatusByType(company_id, type);

  if (!statuses || statuses.length === 0) {
    throw new Error("No statuses found for this type");
  }

  return statuses;
}
