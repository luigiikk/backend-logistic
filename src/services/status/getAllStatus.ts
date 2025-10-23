import { PrismaStatusRepository } from "@/repositories/prisma-status-repository.js";

export async function getAllStatusService() {
  const prismaStatusRepository = new PrismaStatusRepository();

  const status = await prismaStatusRepository.getAllStatus();

  return status;
}
