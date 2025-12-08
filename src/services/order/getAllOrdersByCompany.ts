import { PrismaOrdersRepository } from "@/repositories/prisma-orders-repository.js";

export async function getAllOrdersByCompanyService(company_id: number) {
  const prismaOrderRepository = new PrismaOrdersRepository;

  const orders = await prismaOrderRepository.getAllOrdersByCompany(company_id);

  return orders;
}
