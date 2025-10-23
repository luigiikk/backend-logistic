import { prisma } from "@/lib/prisma.js";
import { PrismaProductsRepository } from "@/repositories/prisma-products-repository.js";

export async function deleteProductService(id: number) {
  const product = await prisma.products.findFirst({
    where: {
      id,
    },
  });

  if (!product) {
    throw new Error("Product not exists");
  }

  const prismaProductsRepository = new PrismaProductsRepository();

  try {
    await prismaProductsRepository.deleteProduct(product.id);
  } catch (error) {
    throw new Error("Error deleting product");
  }
}
