import type { FastifyTypedInstance } from "@/@types/types.js";
import { deletePurchaseOrdersItems } from "@/http/controllers/purchaseOrders/purchaseOrdersItems/deletePurchaseOrdersItems.js";
import { getAllPurchaseOrdersItems } from "@/http/controllers/purchaseOrders/purchaseOrdersItems/getAllPurchaseOrdersItems.js";
import { getPurchaseOrdersItemsById } from "@/http/controllers/purchaseOrders/purchaseOrdersItems/getPurchaseOrdersItemsById.js";
import z from "zod";



export async function purchaseOrdersItemsRoutes(app: FastifyTypedInstance) {
  app.get(
    "",
    {
      schema: {
        tags: ["purchase-orders-items"],
        description: "List All Purchase Orders Items",
        response: {
          200: z.array(
  z.object({
    id: z.number(),
    purchase_order_id: z.number(),
    resource_id: z.number(),
    company_id: z.number(),
    warehouse_id: z.number(),
    quantity: z.number().nullable(),
    unit_price: z.number().nullable(),
    total_price: z.number().nullable(),
    volume: z.number(),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),

    resource: z.object({
      id: z.number(),
      name: z.string().nullable(),
      description: z.string().nullable(),
      category_id: z.number().nullable(),
      company_id: z.number(),
      created_at: z.coerce.date(),
      updated_at: z.coerce.date(),
    }),
  })
),
        },
      },
    },
    getAllPurchaseOrdersItems
  );

  app.get(
    "/:id",
    {
      schema: {
        tags: ["purchase-orders-items"],
        description: "List All Purchase Orders Items",
        params: z.object({
          id: z.coerce.number(),
        }),
        response: {
          200: 
            z.object({
              purchase_order_id: z.number(),
              resource_id: z.number(),
              company_id: z.number(),
              warehouse_id: z.number(),
              quantity: z.number(),
              unit_price: z.float32(),
              total_price: z.float32(),
              created_at: z.coerce.date(),
              updated_at: z.coerce.date(),

              resource: z.object({
                id: z.number().int(),
                name: z.string(),
                description: z.string(),
                quantity: z.number(),
                category_id: z.number(),
                company_id: z.number(),
                created_at: z.coerce.date(),
                updated_at: z.coerce.date(),
              }),
            })
        },
      },
    },
    getPurchaseOrdersItemsById
  );

  app.delete(
    "/:id",
    {
      schema: {
        tags: ["purchase-orders-items"],
        description: "Delete Purchase Order Item",
        params: z.object({
          id: z.coerce.number(),
        }),
        response: {
          200: z.object({ message: z.string() }),
        },
      },
    },
    deletePurchaseOrdersItems
  );
}