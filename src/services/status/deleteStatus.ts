import { prisma } from "@/lib/prisma.js";
import { PrismaStatusRepository } from "@/repositories/prisma-status-repository.js";

export async function deleteStatusService(id: number) {
  const status = await prisma.status.findFirst({
    where: {
      id,
    },
  });

  if (!status) {
    throw new Error("Status not exists");
  }

  const prismasStatusRepository = new PrismaStatusRepository();

  try {
    await prismasStatusRepository.deleteStatus(status.id);
  } catch (error) {
    throw new Error("Error deleting status");
  }
}
