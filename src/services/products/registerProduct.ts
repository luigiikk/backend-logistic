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
  order_id
}: ProductRegisterParams) {

    const orderExists = await prisma.orders.findUnique({
    where: { id: order_id },
  });

  if (!orderExists) {
    throw new Error("Order not found");
  }

  const prismaProductsRepository = new PrismaProductsRepository;

  await prismaProductsRepository.create({
    name,
    description,
    quantity,
    order: { connect: { id: order_id } }, 
  });
}
