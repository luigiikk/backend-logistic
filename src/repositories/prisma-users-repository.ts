import { prisma } from "@/lib/prisma.js";
import { Prisma } from "@prisma/client";


export class PrismaUsersRepository {
  async create(data: Prisma.UsersCreateInput){
    const user = await prisma.users.create({
      data,
    });

    return user;
  }

  async getAllUsers(){
    const users = await prisma.users.findMany();
    
    const listUsers = users.map(({ name, enrollment, email, phone_number }) => ({
      name,
      enrollment,
      email,
      phone_number
    }));

    return listUsers;
  }

  async deleteUser(enrollment: string){
    await prisma.users.delete({
      where: {
        enrollment,
      }
    })
  }
}