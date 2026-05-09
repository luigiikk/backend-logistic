import { PrismaOrdersRepository } from "@/repositories/prisma-orders-repository.js";

interface AllocateVehicleParams {
  order_id: number;
  vehicle_id: number;
  company_id: number;
}

export async function allocateVehicleToOrderService({
  order_id,
  vehicle_id,
  company_id,
}: AllocateVehicleParams) {
  const prismaOrderRepository = new PrismaOrdersRepository();

  return await prismaOrderRepository.allocateVehicleToOrder(order_id, vehicle_id, company_id);
}