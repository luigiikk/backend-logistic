import { PrismaOrdersRepository } from "@/repositories/prisma-orders-repository.js";

export interface OrderUpdateCompanyParams {
  order_id: number;
  company_id: number;

  vehicle_id?: number;
  status_id?: number;

  recipient?: {
    name?: string;
    cpf?: string;
    email?: string;
    address?: {
      street?: string | null;
      number?: number | null;
      complement?: string | null;
      city?: string | null;
      state?: string | null;
      country?: string | null;
      zipcode?: string | null;
    };
  };

  products?: {
    id?: number;
    name?: string | null;
    description?: string | null;
    quantity?: number | null;
  }[];
}

export async function updateOrderByCompanyService(params: OrderUpdateCompanyParams) {
  const prismaOrdersRepository = new PrismaOrdersRepository();
  return await prismaOrdersRepository.updateOrderByCompany(params);
}
