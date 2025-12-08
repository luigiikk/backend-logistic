import { PrismaOrdersRepository } from "@/repositories/prisma-orders-repository.js";

export interface GetOrderByCodeParams{
  code: string
}


export async function getOrderByCodeService({
  code,
}: GetOrderByCodeParams) {
  const prismaOrderRepository = new PrismaOrdersRepository;

  const order = await prismaOrderRepository.getOrderByCode(code);

  if(!order){
    throw new Error('order not found');
  }
  return order;
}
