import { PrismaOrdersRepository } from "@/repositories/prisma-orders-repository.js";

export interface OrderUpdateParams {
  sender_client_id: number;
  recipient_id: number;
  status_id: number;
  vehicle_id: number;
}

export async function updateOrderService(
  id: number, company_id: number,
  {
    sender_client_id,
    recipient_id,
    status_id,
    vehicle_id,
  }: OrderUpdateParams
) {
  const prismaOrderRepository = new PrismaOrdersRepository();

  await prismaOrderRepository.updateOrder(id, company_id, {
    sender_client_id,
    recipient_id,
    status_id,
    vehicle_id,
  });
}
