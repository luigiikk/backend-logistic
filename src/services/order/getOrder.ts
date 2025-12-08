import { PrismaOrdersRepository } from "@/repositories/prisma-orders-repository.js";

export async function getOrderService(id: number, company_id: number) {
  const prismaOrderRepository = new PrismaOrdersRepository;

  const order = await prismaOrderRepository.getOrder(id, company_id);

  if(!order){
    throw new Error('order not found');
  }
  return order;
}
