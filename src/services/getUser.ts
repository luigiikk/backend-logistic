import { PrismaUsersRepository } from "@/repositories/prisma-users-repository.js";


export async function getUserService(id: number) {
  const prismaUsersRepository = new PrismaUsersRepository;

  const user = await prismaUsersRepository.getUser(id);

  if(!user){
    throw new Error('User not found');
  }
  return user;
}
