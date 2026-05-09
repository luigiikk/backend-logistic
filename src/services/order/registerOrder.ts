import { prisma } from "@/lib/prisma.js";
import { PrismaOrdersRepository } from "@/repositories/prisma-orders-repository.js";
import { generateTrackingCode } from "@/util/generateTrackingCode.js";

export interface OrderRegisterParams {
  sender_client_id: number;
  company_id: number;

  recipient: {
    name: string;
    cpf: string;
    email: string;
    address: {
      street?: string | null;
      number?: number | null;
      complement?: string | null;
      city?: string | null;
      state?: string | null;
      country?: string | null;
      zipcode?: string | null;
    };
  };

  products: {
    name?: string | null;
    description?: string | null;
    quantity?: number | null;
    height: number;
    width: number;
    depth: number;
  }[];
}

export async function registerOrderByClientService({
  sender_client_id,
  company_id,
  recipient,
  products,
}: OrderRegisterParams) {
  const prismaOrderRepository = new PrismaOrdersRepository;

  const order = await prismaOrderRepository.createOrderByClient({sender_client_id, company_id, recipient, products});

  return order;
}
