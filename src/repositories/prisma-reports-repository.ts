import { prisma } from "@/lib/prisma.js";

export class PrismaReportsRepository {
  async getOrdersByMonth(company_id: number, year: number, month: number) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const [orders, total] = await Promise.all([
      prisma.orders.findMany({
        where: {
          company_id,
          created_at: { gte: start, lt: end },
        },
        select: {
          id: true,
          code: true,
          status: { select: { name: true } },
          created_at: true,
          products: {
            select: { quantity: true, volume: true },
          },
        },
      }),
      prisma.orders.count({
        where: {
          company_id,
          created_at: { gte: start, lt: end },
        },
      }),
    ]);

    return { orders, total, year, month };
  }

  async getOrdersByPeriod(
    company_id: number,
    start_date: Date,
    end_date: Date
  ) {
    const [orders, total] = await Promise.all([
      prisma.orders.findMany({
        where: {
          company_id,
          created_at: { gte: start_date, lte: end_date },
        },
        select: {
          id: true,
          code: true,
          status: { select: { name: true } },
          created_at: true,
          products: {
            select: { quantity: true, volume: true },
          },
        },
      }),
      prisma.orders.count({
        where: {
          company_id,
          created_at: { gte: start_date, lte: end_date },
        },
      }),
    ]);

    return { orders, total, start_date, end_date };
  }

  async getProductsByMonth(company_id: number, year: number, month: number) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const orders = await prisma.orders.findMany({
      where: {
        company_id,
        created_at: { gte: start, lt: end },
      },
      select: {
        id: true,
        code: true,
        products: {
          select: {
            id: true,
            name: true,
            quantity: true,
            volume: true,
            height: true,
            width: true,
            length: true,
          },
        },
      },
    });

    const products = orders.flatMap((o) => o.products);
    const total_quantity = products.reduce((acc, p) => acc + (p.quantity ?? 0), 0);
    const total_volume = products.reduce((acc, p) => acc + p.volume, 0);

    return { products, total_products: products.length, total_quantity, total_volume, year, month };
  }
}