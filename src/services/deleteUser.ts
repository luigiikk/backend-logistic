import { prisma } from "@/lib/prisma.js";
import { PrismaUsersRepository } from "@/repositories/prisma-users-repository.js";


export async function deleteUserService(id: number) {
  const user = await prisma.users.findFirst({
    where: {
      id,
    }
  })
  
  if(!user){
    throw new Error('User not exists');
  }

  const prismaUsersRepository = new PrismaUsersRepository;

  try {
    await prismaUsersRepository.deleteUser(user.id);
  } catch(error) {
    throw new Error("Error deleting user");
  }
  
}
