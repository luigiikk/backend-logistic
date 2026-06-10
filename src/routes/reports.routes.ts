import type { FastifyTypedInstance } from "@/@types/types.js";
import { getOrdersByMonth } from "@/http/controllers/reports/orderByMonth.js";
import { getOrdersByPeriod } from "@/http/controllers/reports/orderByPeriod.js";
import { getProductsByMonth } from "@/http/controllers/reports/productByMonth.js";
import z from "zod";

const productSchema = z.object({
  id: z.number(),
  name: z.string().nullable(),
  quantity: z.number().nullable(),
  volume: z.number(),
  height: z.number(),
  width: z.number(),
  length: z.number(),
});

const orderSchema = z.object({
  id: z.number(),
  code: z.string().nullable(),
  status: z.object({ name: z.string() }),
  created_at: z.date(),
  products: z.array(
    z.object({
      quantity: z.number().nullable(),
      volume: z.number(),
    })
  ),
});

export async function reportsRoutes(app: FastifyTypedInstance) {
  // GET /reports/orders/month?year=2026&month=6
  app.get(
    "/orders/month",
    {
      schema: {
        tags: ["reports"],
        description: "Get orders by month and year",
        querystring: z.object({
          year: z.coerce.number().int().min(2000),
          month: z.coerce.number().int().min(1).max(12),
        }),
        response: {
          200: z.object({
            year: z.number(),
            month: z.number(),
            total: z.number(),
            orders: z.array(orderSchema),
          }),
        },
      },
    },
    getOrdersByMonth
  );

  // GET /reports/orders/period?start_date=2026-01-01&end_date=2026-06-30
  app.get(
    "/orders/period",
    {
      schema: {
        tags: ["reports"],
        description: "Get orders by period",
        querystring: z.object({
          start_date: z.string(),
          end_date: z.string(),
        }),
        response: {
          200: z.object({
            start_date: z.date(),
            end_date: z.date(),
            total: z.number(),
            orders: z.array(orderSchema),
          }),
        },
      },
    },
    getOrdersByPeriod
  );

  // GET /reports/products/month?year=2026&month=6
  app.get(
    "/products/month",
    {
      schema: {
        tags: ["reports"],
        description: "Get products by month and year",
        querystring: z.object({
          year: z.coerce.number().int().min(2000),
          month: z.coerce.number().int().min(1).max(12),
        }),
        response: {
          200: z.object({
            year: z.number(),
            month: z.number(),
            total_products: z.number(),
            total_quantity: z.number(),
            total_volume: z.number(),
            products: z.array(productSchema),
          }),
        },
      },
    },
    getProductsByMonth
  );
}