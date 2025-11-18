import { PrismaAddresRepository } from "@/repositories/prisma-address-repository.js";

export async function getAllAddresService() {
  const prismaAddresRepository = new PrismaAddresRepository;

  const addres = await prismaAddresRepository.getAllAddres();

  return addres;
}
