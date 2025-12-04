import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma.js";
import type { OrderUpdateParams } from "@/services/order/updateOrder.js";
import { generateTrackingCode } from "@/util/generateTrackingCode.js";

export interface CreateOrderByClientParams {
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
  }[];
}

export interface CreateOrderByCompanyParams {
  company_id: number;
  vehicle_id: number;

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
  }[];
}

export class PrismaOrdersRepository {
  async createOrderByClient({
    sender_client_id,
    company_id,
    recipient,
    products,
  }: CreateOrderByClientParams) {
    return await prisma.$transaction(async (tx) => {

      let newRecipient: any = null;
  
      const newRecipientAddress = await tx.addres.create({
        data: {
          street: recipient.address.street,
          number: recipient.address.number,
          complement: recipient.address.complement,
          city: recipient.address.city,
          state: recipient.address.state,
          country: recipient.address.country,
          zipcode: recipient.address.zipcode,
        },
      });
  
      const exist_recipient = await tx.recipient.findUnique({
        where: {
          cpf: recipient.cpf
        }
      })

      if(!exist_recipient){
        const newRecipient = await tx.recipient.create({
          data: {
            name: recipient.name,
            cpf: recipient.cpf,
            email: recipient.email,
            addres: { connect: { id: newRecipientAddress.id } },
          },
        });
      }

      const recipientId = newRecipient?.id ?? exist_recipient!.id;
  
      const trackingCode = await generateTrackingCode();

      const status = await tx.status.findFirstOrThrow({
        where: {
          is_default: true
        }
      });
  
      const newOrder = await tx.orders.create({
        data: {
          code: trackingCode,
          sender_client: { connect: { id: sender_client_id } },
          recipient: { connect: { id: recipientId } },
          status: { connect: { id: status.id } },
          company: { connect: { id: company_id } },
        },
      });
  
      if (products.length > 0) {
        await tx.products.createMany({
          data: products.map((p) => ({
            order_id: newOrder.id,
            name: p.name ?? null,
            description: p.description ?? null,
            quantity: p.quantity ?? null,
          })),
        });
      }
  
      return {
        order: newOrder,
        recipient: newRecipient,
      };
    });
  }

  async createOrderByCompany({
    company_id,
    vehicle_id,
    recipient,
    products,
  }: CreateOrderByCompanyParams) {
    return await prisma.$transaction(async (tx) => {
      let newRecipient: any = null;
  
      const newRecipientAddress = await tx.addres.create({
        data: {
          street: recipient.address.street,
          number: recipient.address.number,
          complement: recipient.address.complement,
          city: recipient.address.city,
          state: recipient.address.state,
          country: recipient.address.country,
          zipcode: recipient.address.zipcode,
        },
      });
  
      const exist_recipient = await tx.recipient.findUnique({
        where: {
          cpf: recipient.cpf
        }
      })

      if(!exist_recipient){
        const newRecipient = await tx.recipient.create({
          data: {
            name: recipient.name,
            cpf: recipient.cpf,
            email: recipient.email,
            addres: { connect: { id: newRecipientAddress.id } },
          },
        });
      }

      const recipientId = newRecipient?.id ?? exist_recipient!.id;
      
  
      const trackingCode = await generateTrackingCode();

      const status = await tx.status.findFirstOrThrow({
        where: {
          is_default: true
        }
      });

      const vehicle = await tx.vehicles.findFirstOrThrow({
        where: {
          id: vehicle_id
        }
      })
  
      const newOrder = await tx.orders.create({
        data: {
          code: trackingCode,
          vehicle: { connect: { id: vehicle.id } },
          recipient: { connect: { id: recipientId } },
          status: { connect: { id: status.id } },
          company: { connect: { id: company_id } },
        },
      });
  
      if (products.length > 0) {
        await tx.products.createMany({
          data: products.map((p) => ({
            order_id: newOrder.id,
            name: p.name ?? null,
            description: p.description ?? null,
            quantity: p.quantity ?? null,
          })),
        });
      }
  
      return {
        order: newOrder,
        recipient: newRecipient,
      };
    });
  }

  async getAllOrdersByCompany(company_id: number) {
  return await prisma.orders.findMany({
    where: { company_id }, 
    select: {
      code: true,
      sender_client: { select: { name: true } },
      recipient: { select: { name: true } },
      status: { select: { name: true } },
      vehicle: { select: { plate: true } },
    },
  });
}

  async getOrdersByRecipient(recipient_id: number){
    const orders = await prisma.orders.findMany({
      where:{
        recipient_id,
      }
    })
    return orders;
  }

  async getOrdersBySender(sender_client_id: number){
    const orders = await prisma.orders.findMany({
      where:{
        sender_client_id,
      }
    })
    return orders;
  }

  async getOrder(id: number, company_id: number) {
   const order = await prisma.orders.findUnique({
    where: { id, company_id },
    select: {
      code: true,
      sender_client: { select: { name: true } },
      recipient: { select: { name: true } },
      status: { select: { name: true } },
      vehicle: { select: { plate: true } },
    },
  });
    return order;
  }

  async deleteOrder(id: number) {
    const order = await prisma.orders.delete({
      where: {
        id,
      },
    });
    return order;
  }

  async updateOrder(id: number, company_id: number, data: OrderUpdateParams) {
    const orderExists = await prisma.orders.findUnique({ where: { id } });

    if (!orderExists) {
      throw new Error("order not found");
    }

    if(company_id != orderExists.company_id){
      throw new Error("order not update");
    }
    await prisma.orders.update({
      where: { id },
      data,
    });
  }
}
