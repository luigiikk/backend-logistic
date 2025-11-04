import { PrismaOrdersRepository } from "@/repositories/prisma-orders-repository.js";
import { generateTrackingCode } from "@/util/generateTrackingCode.js";

interface OrderRegisterParams {
  sender_client_id: number;
  recipient_id: number;
  status_id: number;
  company_id: number;
  vehicle_id: number;
}

export async function registerOrderService({
  sender_client_id,
  recipient_id,
  status_id,
  company_id,
  vehicle_id,
}: OrderRegisterParams) {
  const prismaOrderRepository = new PrismaOrdersRepository();

  const code = await generateTrackingCode();

  const order = await prismaOrderRepository.create({
    code,
    sender_client: { connect: { id: sender_client_id } },
    recipient: { connect: { id: recipient_id } },
    status: { connect: { id: status_id } },
    company: { connect: { id: company_id } },
    vehicle: { connect: { id: vehicle_id } },
  });
  return order;
}
