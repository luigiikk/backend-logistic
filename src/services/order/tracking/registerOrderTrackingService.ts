import { PrismaOrdersRepository } from "@/repositories/prisma-orders-repository.js";

export interface OrderTrackingRegisterParams {
  order_id: number;
  company_id: number;

  status_id: number;

  location?: string | null;

  description: string;

  estimated_delivery?: Date | string | null;
}

export async function registerOrderTrackingService({
  order_id,
  company_id,
  status_id,
  location,
  description,
  estimated_delivery,
}: OrderTrackingRegisterParams) {
  const prismaOrderRepository = new PrismaOrdersRepository();

  const order = await prismaOrderRepository.getOrder(order_id, company_id);

  if (!order) {
    throw new Error("Order not found");
  }

  await prismaOrderRepository.updateOrderStatus(
    order_id,
    status_id
  );

  const tracking = await prismaOrderRepository.createOrderTracking({
    order_id,
    status_id,
    location,
    description,
    estimated_delivery:
      estimated_delivery
        ? new Date(estimated_delivery)
        : null,
  });

  return tracking;
}