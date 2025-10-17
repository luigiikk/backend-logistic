import { PrismaProductsRepository } from "@/repositories/prisma-products-repository.js";


export async function getProductService(id: number) {
  const prismaProductsRepository = new PrismaProductsRepository;

  const product = await prismaProductsRepository.getProduct(id);

  if(!product){
    throw new Error('Product not found');
  }
  return product;
}
