import { PrismaOrdersRepository } from "@/repositories/prisma-orders-repository.js";

export async function getOrderService(id: number) {
  const prismaOrderRepository = new PrismaOrdersRepository;

  const order = await prismaOrderRepository.getOrder(id);

  if(!order){
    throw new Error('order not found');
  }
  return order;
}
