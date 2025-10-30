import { PrismaOrdersRepository } from "@/repositories/prisma-orders-repository.js";

interface OrderRegisterParams {
  sender_client_id: number;
  receiver_client_id: number;
  status_id: number;
  vehicle_id: number;
}

export async function registerOrderService({
  sender_client_id,
  receiver_client_id,
  status_id,
  vehicle_id,
}: OrderRegisterParams) {
  const prismaOrderRepository = new PrismaOrdersRepository();

  const order = await prismaOrderRepository.create({
    sender_client: { connect: { id: sender_client_id } },
    receiver_client: { connect: { id: receiver_client_id } },
    status: { connect: { id: status_id } },
    vehicle: { connect: { id: vehicle_id } },
  });
  return order;
}
