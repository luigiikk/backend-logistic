import { prisma } from "@/lib/prisma.js";

export class PrismaRolesRepository {

  async getAllRoles() {
    return await prisma.roles.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }
}