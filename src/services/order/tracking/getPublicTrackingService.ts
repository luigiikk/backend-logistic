import { prisma } from "@/lib/prisma.js";
import { PrismaOrdersRepository } from "@/repositories/prisma-orders-repository.js";

export interface GetOrderTrackingPublic{
  code: string
  cpf: string
}

export async function getPublicTrackingService({
  code,
  cpf,
}: GetOrderTrackingPublic) {
  const order = await prisma.orders.findFirst({
    where: {
      code,
  
      recipient: {
        cpf,
      },
    },
  
    include: {
      status: true,
  
      tracking: {
        include: {
          status: true,
        },
  
        orderBy: {
          occurred_at: "desc",
        },
      },
    },
  });

  if(!order){
    throw new Error('order not found');
  }

  return order;
}
