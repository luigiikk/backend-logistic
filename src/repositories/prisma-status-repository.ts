import { prisma } from "@/lib/prisma.js";
import { Prisma } from "@prisma/client";

export class PrismaStatusRepository {
  async create(data: Prisma.StatusCreateInput) {
    const status = await prisma.status.create({ 
      data 
    });

    return status;
  }

  async getDefault(user_id: number, type: string) {
    const status = await prisma.status.findFirst({
      where: {
        user_id,
        type,
        is_default: true,
      },
    });

    return status;
  }

  async getAllStatus() {
    return await prisma.status.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        is_default: true,
        user_id: true,
      },
      orderBy: {
        id: "asc",
      },
    });
  }

  async getStatus(id: number) {
    const status = await prisma.status.findUnique({
      where: {
        id,
      },
    });

    return status;
  }

  async deleteStatus(id: number) {
    await prisma.status.delete({
      where: { 
        id 
      },
    });
  }
}
