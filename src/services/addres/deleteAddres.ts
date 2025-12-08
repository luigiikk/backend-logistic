import { prisma } from "@/lib/prisma.js";
import { PrismaAddresRepository } from "@/repositories/prisma-address-repository.js";


export async function deleteAddresService(id: number) {
  const addres = await prisma.addres.findFirst({
    where: {
      id,
    }
  })
  
  if(!addres){
    throw new Error('addres not exists');
  }

  const prismaAddresRepository = new PrismaAddresRepository;

  try {
    await prismaAddresRepository.deleteAddres(addres.id);
  } catch(error) {
    throw new Error("Error deleting addres");
  }
  
}
