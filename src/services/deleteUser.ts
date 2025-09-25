import { prisma } from "@/lib/prisma.js";
import { PrismaUsersRepository } from "@/repositories/prisma-users-repository.js";


export async function deleteUserService(enrollment: string) {
  const user = await prisma.users.findUnique({
    where: {
      enrollment,
    }
  })

  if(user === null){
    throw new Error('User not exists');
  }
  const prismaUsersRepository = new PrismaUsersRepository;

  try {
    prismaUsersRepository.deleteUser(user.enrollment);
  } catch(error) {
    console.error(error);
  }
  
}
