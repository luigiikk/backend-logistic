import { PrismaStatusRepository } from "@/repositories/prisma-status-repository.js";

export async function getAllStatusByCompanyService(company_id: number) {
  const prismaStatusRepository = new PrismaStatusRepository();

  const status = await prismaStatusRepository.getAllStatusByCompany(company_id);

  return status;
}
