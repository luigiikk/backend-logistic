import { PrismaStatusRepository } from "@/repositories/prisma-status-repository.js";

export async function getAllStatusByCompanyService() {
  const prismaStatusRepository = new PrismaStatusRepository();

  const status = await prismaStatusRepository.getAllStatusByCompany();

  return status;
}
