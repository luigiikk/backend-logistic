import { PrismaStatusRepository } from "@/repositories/prisma-status-repository.js";

export async function getStatusService(id: number) {
  const prismaStatusRepository = new PrismaStatusRepository();

  const status = await prismaStatusRepository.getStatus(id);

  if (!status) {
    throw new Error("Status not found");
  }
  return status;
}
