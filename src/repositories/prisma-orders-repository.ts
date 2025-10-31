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

  async getAllOrders() {
    return await prisma.orders.findMany({
      select: {
        id: true,
        sender_client_id: true,
        receiver_client_id: true,
        status_id: true,
        vehicle_id: true,
      },
    });
  }
  async getOrder(id: number) {
    const order = await prisma.orders.findUnique({
      where: {
        id,
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

  async updateOrder(id: number, data: OrderUpdateParams) {
    const orderExists = await prisma.orders.findUnique({ where: { id } });

    if (!orderExists) {
      throw new Error("order not found");
    }
    await prisma.orders.update({
      where: { id },
      data,
    });
  }
}
