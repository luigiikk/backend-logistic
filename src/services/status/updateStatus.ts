import { PrismaStatusRepository } from "@/repositories/prisma-status-repository.js";

export interface StatusUpdateParams {
  name: string;
  type: "order" | "vehicle" | "invoice" | "purchase_order";
  is_default: boolean;
}

export async function updateStatusService(
  id: number, company_id: number,
  { name, type, is_default }: StatusUpdateParams
) {
  const prismaStatusRepository = new PrismaStatusRepository();

  await prismaStatusRepository.updateStatus(id, company_id, {
    name,
    type,
    is_default,
  });
}
