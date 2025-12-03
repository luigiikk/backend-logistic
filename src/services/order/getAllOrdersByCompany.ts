import { PrismaOrdersRepository } from "@/repositories/prisma-orders-repository.js";

export async function getAllOrdersByCompanyService() {
  const prismaOrderRepository = new PrismaOrdersRepository;

  const orders = await prismaOrderRepository.getAllOrdersByCompany();

  return orders;
}
