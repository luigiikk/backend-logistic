import { prisma } from "@/lib/prisma.js";
import { PrismaOrdersRepository } from "@/repositories/prisma-orders-repository.js";

export async function deleteOrderService(id: number) {
  const order = await prisma.orders.findFirst({
    where: {
      id,
    }
  })
  
  if(!order){
    throw new Error('order not exists');
  }

  const prismaOrderRepository = new PrismaOrdersRepository;

  try {
    await prismaOrderRepository.deleteOrder(order.id);
  } catch(error) {
    throw new Error("Error deleting order");
  }
  
}
