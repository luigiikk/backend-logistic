import type { FastifyTypedInstance } from "@/@types/types.js";
import { getAllPurchaseOrdersItems } from "@/http/controllers/purchaseOrders/purchaseOrdersItems/getAllPurchaseOrdersItems.js";
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
              purchase_order_id: z.number(),
              resource_id: z.number(),
              company_id: z.number(),
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
          ),
        },
      },
    },
    getAllPurchaseOrdersItems
  );
}