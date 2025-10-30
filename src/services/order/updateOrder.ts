import { PrismaOrdersRepository } from "@/repositories/prisma-orders-repository.js";

export interface OrderUpdateParams {
  sender_client_id: number;
  receiver_client_id: number;
  status_id: number;
  vehicle_id: number;
}

export async function updateOrderService(
  id: number,
  {
    sender_client_id,
    receiver_client_id,
    status_id,
    vehicle_id,
  }: OrderUpdateParams
) {
  const prismaOrderRepository = new PrismaOrdersRepository();

  await prismaOrderRepository.updateOrder(id, {
    sender_client_id,
    receiver_client_id,
    status_id,
    vehicle_id,
  });
}
