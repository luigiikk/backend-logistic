import { PrismaAddresRepository } from "@/repositories/prisma-address-repository.js";


export async function getAddresService(id: number) {
  const prismaAddresRepository = new PrismaAddresRepository;

  const addres = await prismaAddresRepository.getAddres(id);

  if(!addres){
    throw new Error('addres not found');
  }
  return addres;
}
