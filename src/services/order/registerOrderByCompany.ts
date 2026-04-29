import { PrismaOrdersRepository } from "@/repositories/prisma-orders-repository.js";


export interface OrderRegisterCompanyParams {
  company_id: number;
  vehicle_id?: number;

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

export async function registerOrderByCompanyService({
  company_id,
  vehicle_id,
  recipient,
  products,
}: OrderRegisterCompanyParams) {
  const prismaOrderRepository = new PrismaOrdersRepository;

  const order = await prismaOrderRepository.createOrderByCompany({company_id, vehicle_id, recipient, products});

  return order;
}
