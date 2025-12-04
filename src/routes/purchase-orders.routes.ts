import type { FastifyTypedInstance } from "@/@types/types.js";
import { purchaseOrders, purchaseOrdersBodySchema } from "@/http/controllers/purchaseOrders/purchase-orders.js";
import { purchaseOrdersItems, purchaseOrdersItemsBodySchema } from "@/http/controllers/purchaseOrders/purchaseOrdersItems/purchase-orders-items.js";
import z from "zod";



export async function purchaseOrdersRoutes(app: FastifyTypedInstance) {
  app.post(
    "",
    {
      schema: {
        tags: ["purchase-orders"],
        description: "Purchase Orders",
        body: purchaseOrdersBodySchema,
        response: {
          201: z.null().describe("Purchase Order"),
        },
      },
    },
    purchaseOrders
  );

  app.post(
    "/:purchaseOrdersId/items",
    {
      schema: {
        tags: ["purchase-orders-items"],
        description: "Purchase Orders",
        params: z.object({
          purchaseOrdersId: z.coerce.number(),
        }),
        body: purchaseOrdersItemsBodySchema,
        response: {
          201: z.null().describe("Purchase Order item"),
        },
      },
    },
    purchaseOrdersItems
  );
}