import { prisma } from "@/lib/prisma.js";
import { PrismaProductsRepository } from "@/repositories/prisma-products-repository.js";

interface ProductRegisterParams {
  name: string;
  description: string;
  quantity: number;
  order_id: number;
}

export async function registerProductService({
  name,
  description,
  quantity,
  order_id,
}: ProductRegisterParams) {
  const orderExists = await prisma.orders.findUnique({
    where: { id: order_id },
  });

  if (!orderExists) {
    throw new Error("Order not found");
  }

  const existingProduct = await prisma.products.findFirst({
    where: { name, description, order_id },
  });

  if (existingProduct) {
    throw new Error("Product with this name and description already exists in this order");
  }

  const prismaProductsRepository = new PrismaProductsRepository();

  const product = await prismaProductsRepository.create({
    name,
    description,
    quantity,
    order: { connect: { id: order_id } },
  });
  return product; 
}
