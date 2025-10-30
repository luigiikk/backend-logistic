import { PrismaOrdersRepository } from "@/repositories/prisma-orders-repository.js";

export async function getAllOrdersService() {
  const prismaOrderRepository = new PrismaOrdersRepository;

  const orders = await prismaOrderRepository.getAllOrders();

  return orders;
}
