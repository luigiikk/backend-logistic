import { prisma } from "@/lib/prisma.js";
import type { UserUpdateParams } from "@/services/updateUser.js";
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
  
  async getUser(id: number){
    const user = await prisma.users.findUnique({
      where: {
        id,
      }
    });

    return user;
  }

  async deleteUser(id: number){
    await prisma.users.delete({
      where: {
        id,
      }
    })
  }

  async updateUser(id: number, data: UserUpdateParams) {
    const userExists = await prisma.users.findUnique({ where: { id } });
    if (!userExists) {
      throw new Error('User not found');
    }
    await prisma.users.update({
      where: { id }, 
      data,            
    });
  }
}