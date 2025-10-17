import { PrismaProductsRepository } from "@/repositories/prisma-products-repository.js";


export async function getAllProductsService() {
  const prismaProductsRepository = new PrismaProductsRepository;

  const products = await prismaProductsRepository.getAllProducts();

  return products;
}
