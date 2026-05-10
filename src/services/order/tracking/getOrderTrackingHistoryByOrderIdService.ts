import { PrismaOrdersRepository } from "@/repositories/prisma-orders-repository.js";

export interface GetOrderTrackingByIdParams{
  order_id: number
  company_id: number
}


export async function getOrderTrackingHistoryByOrderIdService({
  order_id,
  company_id,
}: GetOrderTrackingByIdParams) {
  const prismaOrderRepository = new PrismaOrdersRepository;

  const order = await prismaOrderRepository.getOrderWithTracking(order_id, company_id);

  if(!order){
    throw new Error('order not found');
  }
  return order;
}
