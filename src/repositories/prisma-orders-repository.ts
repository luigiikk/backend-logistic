import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma.js";
import type { OrderUpdateCompanyParams } from "@/services/order/updateOrderByCompany.js";
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
    height: number;
    width: number;
    depth: number;
  }[];
}

export interface CreateOrderByCompanyParams {
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
          cpf: recipient.cpf,
        },
      });

      if (!exist_recipient) {
        newRecipient = await tx.recipient.create({
          data: {
            name: recipient.name,
            cpf: recipient.cpf,
            email: recipient.email,
            addres: { connect: { id: newRecipientAddress.id } },
          },
        });
      }

      if (exist_recipient) {
        await tx.recipient.update({
          where: { id: exist_recipient.id },
          data: {
            addres: { connect: { id: newRecipientAddress.id } },
          },
        });
      }

      const recipientId = newRecipient?.id ?? exist_recipient!.id;

      const trackingCode = await generateTrackingCode();

      const status = await tx.status.findFirstOrThrow({
        where: {
          is_default: true,
        },
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
          data: products.map((p) => {
            if (!p.height || !p.width || !p.depth) {
              throw new Error("Missing product dimensions");
            }
            const unitVolume = p.height * p.width * p.depth;
            const totalVolume = unitVolume * (p.quantity ?? 1);

            return {
              order_id: newOrder.id,
              name: p.name ?? null,
              description: p.description ?? null,
              quantity: p.quantity ?? 1,
              height: p.height,
              width: p.width,
              depth: p.depth,
              volume: totalVolume,
            };
          }),
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
          cpf: recipient.cpf,
        },
      });

      if (!exist_recipient) {
        newRecipient = await tx.recipient.create({
          data: {
            name: recipient.name,
            cpf: recipient.cpf,
            email: recipient.email,
            addres: { connect: { id: newRecipientAddress.id } },
          },
        });
      }

      if (exist_recipient) {
        await tx.recipient.update({
          where: { id: exist_recipient.id },
          data: {
            addres: { connect: { id: newRecipientAddress.id } },
          },
        });
      }

      const recipientId = newRecipient?.id ?? exist_recipient!.id;

      const trackingCode = await generateTrackingCode();

      const status = await tx.status.findFirstOrThrow({
        where: {
          is_default: true,
        },
      });

      let vehicleConnect = undefined;

      if (vehicle_id) {
      const vehicle = await tx.vehicles.findFirstOrThrow({
        where: { id: vehicle_id },
      });

      const usedVolumeVehicle = await tx.products.aggregate({
        _sum: { volume: true },
        where: {
          order: { vehicle_id },
        },
      });

      const used = usedVolumeVehicle._sum.volume ?? 0;

      const newProductsVolume = products.reduce((acc, p) => {
        if (!p.height || !p.width || !p.depth) {
          throw new Error("Missing product dimensions");
        }
        const unit = p.height * p.width * p.depth;
        return acc + unit * (p.quantity ?? 1);
      }, 0);

      if (used + newProductsVolume > vehicle.total_volume) {
        throw new Error("Vehicle capacity exceeded");
      }

      vehicleConnect = { connect: { id: vehicle.id } };
    }

      const newOrder = await tx.orders.create({
      data: {
        code: trackingCode,
        recipient: { connect: { id: recipientId } },
        status: { connect: { id: status.id } },
        company: { connect: { id: company_id } },
        ...(vehicleConnect && { vehicle: vehicleConnect }),
      },
    });

      if (products.length > 0) {
        await tx.products.createMany({
          data: products.map((p) => {
            const unitVolume = p.height * p.width * p.depth;
            const totalVolume = unitVolume * (p.quantity ?? 1);

            return {
              order_id: newOrder.id,
              name: p.name ?? null,
              description: p.description ?? null,
              quantity: p.quantity ?? 1,
              height: p.height,
              width: p.width,
              depth: p.depth,
              volume: totalVolume,
            };
          }),
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
        id: true,
        code: true,
        sender_client: { select: { name: true } },
        recipient: { select: { name: true } },
        status: { select: { name: true } },
        vehicle: { select: { plate: true } },
      },
    });
  }

  async getOrdersByRecipient(recipient_id: number) {
    const orders = await prisma.orders.findMany({
      where: {
        recipient_id,
      },
    });
    return orders;
  }

  async getOrdersBySender(sender_client_id: number) {
    const orders = await prisma.orders.findMany({
      where: {
        sender_client_id,
      },
    });
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

  async getOrderByCode(code: string) {
    const order = await prisma.orders.findUnique({
      where: { code: code },
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

  async getOrderByCpf(cpf: string) {
    const recipient = await prisma.recipient.findUnique({
      where: {
        cpf,
      },
    });
    if (!recipient) {
      throw new Error("Recipent not found");
    }

    const order = await prisma.orders.findMany({
      where: { recipient_id: recipient.id },
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

  async updateOrderByCompany({
    order_id,
    company_id,
    vehicle_id,
    status_id,
    recipient,
    products,
  }: OrderUpdateCompanyParams) {
    const orderExists = await prisma.orders.findUnique({
      where: { id: order_id },
      include: {
        recipient: true,
      },
    });

    if (!orderExists) {
      throw new Error("order not found");
    }

    if (company_id !== orderExists.company_id) {
      throw new Error("order not allowed to update");
    }

    if (products && products.length > 0) {
      for (const product of products) {
        if (!product.id) continue;

        const { id, height, width, depth, quantity, ...rest } = product;

        let volume;

        if (height !== undefined && width !== undefined && depth !== undefined) {
          const unit = height * width * depth;
          volume = unit * (quantity ?? 1);
        }

        await prisma.products.update({
          where: { id },
          data: {
            ...rest,
            height,
            width,
            depth,
            quantity,
            ...(volume !== undefined && { volume }),
          },
        });
      }
    }

    if (vehicle_id) {
      const vehicle = await prisma.vehicles.findFirstOrThrow({
        where: { id: vehicle_id },
      });

      const usedVolumeVehicle = await prisma.products.aggregate({
        _sum: { volume: true },
        where: {
          order: {
            vehicle_id,
            NOT: { id: order_id },
          },
        },
      });

      const used = usedVolumeVehicle._sum.volume ?? 0;

      const orderProducts = await prisma.products.findMany({
        where: { order_id },
      });

      const currentOrderVolume = orderProducts.reduce(
        (acc, p) => acc + (p.volume ?? 0),
        0,
      );

      if (used + currentOrderVolume > vehicle.total_volume) {
        throw new Error("Vehicle capacity exceeded");
      }
    }

    if (recipient) {
      const recipient_id = orderExists.recipient_id;

      await prisma.recipient.update({
        where: { id: recipient_id },
        data: {
          name: recipient.name,
          cpf: recipient.cpf,
          email: recipient.email,
        },
      });

      if (recipient.address) {
        const addressId = orderExists.recipient.addres_id;

        if (!addressId) {
          const newAddress = await prisma.addres.create({
            data: recipient.address,
          });

          await prisma.recipient.update({
            where: { id: recipient_id },
            data: { addres_id: newAddress.id },
          });
        } else {
          await prisma.addres.update({
            where: { id: addressId },
            data: recipient.address,
          });
        }
      }
    }

    const updatedOrder = await prisma.orders.update({
      where: { id: order_id },
      data: {
        ...(vehicle_id && { vehicle_id }),
        ...(status_id && { status_id }),
      },
      include: {
        recipient: true,
        products: true,
        vehicle: true,
        status: true,
      },
    });

    return updatedOrder;
  }
}
