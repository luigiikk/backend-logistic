import { PrismaOrdersRepository } from "@/repositories/prisma-orders-repository.js";


export async function getOrderByCpfService(cpf: string) {
  const prismaOrderRepository = new PrismaOrdersRepository;

  const order = await prismaOrderRepository.getOrderByCpf(cpf);

  if(!order){
    throw new Error('order not found');
  }
  return order;
}
