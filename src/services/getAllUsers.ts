import { PrismaUsersRepository } from "@/repositories/prisma-users-repository.js";


export async function getAllUsersService() {
  const prismaUsersRepository = new PrismaUsersRepository;

  const users = await prismaUsersRepository.getAllUsers();

  return users;
}
