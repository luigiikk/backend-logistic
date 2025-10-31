import { PrismaStatusRepository } from "@/repositories/prisma-status-repository.js";

export interface StatusUpdateParams {
  name: string;
  type: "order" | "vehicle" | "invoice" | "purchase_order";
  is_default: boolean;
  company_id: number;
}

export async function updateStatusService(
  id: number,
  { name, type, is_default, company_id }: StatusUpdateParams
) {
  const prismaStatusRepository = new PrismaStatusRepository();

  await prismaStatusRepository.updateStatus(id, {
    name,
    type,
    is_default,
    company_id,
  });
}
