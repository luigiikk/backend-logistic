import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma.js";
import type { OrderUpdateParams } from "@/services/order/updateOrder.js";

export class PrismaOrdersRepository {
  async create(data: Prisma.OrdersCreateInput) {
    const order = await prisma.orders.create({
      data,
    });
    return order;
  }

  async getAllOrdersByCompany() {
    return await prisma.orders.findMany({
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
