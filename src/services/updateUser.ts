import { prisma } from "@/lib/prisma.js";
import { PrismaUsersRepository } from "@/repositories/prisma-users-repository.js";

export interface UserUpdateParams {
  enrollment: string;
  name: string;
  email: string;
  phone_number: string;
}

export async function updateUserService(id:number, {
  name,
  email,
  enrollment,
  phone_number,
}: UserUpdateParams) {
 
  const prismaUsersRepository = new PrismaUsersRepository;

  await prismaUsersRepository.updateUser(id, {
    name,
    email,
    enrollment,
    phone_number,
  });
}
