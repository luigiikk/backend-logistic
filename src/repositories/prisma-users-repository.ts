import { prisma } from "@/lib/prisma.js";
import { Prisma } from "@prisma/client";


export class PrismaUsersRepository {
  async create(data: Prisma.UsersCreateInput){
    const user = await prisma.users.create({
      data,
    });

    return user;
  }
}