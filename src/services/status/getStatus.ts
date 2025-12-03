import { PrismaStatusRepository } from "@/repositories/prisma-status-repository.js";

export async function getStatusService(id: number, company_id: number) {
  const prismaStatusRepository = new PrismaStatusRepository();

  const status = await prismaStatusRepository.getStatus(id, company_id);

  if (!status) {
    throw new Error("Status not found");
  }
  return status;
}
