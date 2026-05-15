import type { FastifyTypedInstance } from "@/@types/types.js";
import { getAllPurchaseOrders } from "@/http/controllers/purchaseOrders/getAllPurchaseOrders.js";
import { getPurchaseOrdersById } from "@/http/controllers/purchaseOrders/getPurchaseOrderById.js";
import { purchaseOrders, purchaseOrdersBodySchema } from "@/http/controllers/purchaseOrders/purchase-orders.js";
import { purchaseOrdersUpdateBodySchema, updatePurchaseOrder } from "@/http/controllers/purchaseOrders/updatePurchaseOrder.js";
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

  app.get(
    "/:id",
    {
      schema: {
        tags: ["purchase-orders"],
        description: "Get purchase order by ID",
        params: z.object({
          id: z.coerce.number(),
        }),
        response: {
          200: z.object({
            id: z.number().int(),
            supplier_id: z.number().int(),
            status_id: z.number().int(),
            total_value: z.number(),
            company_id: z.number().int(),
  
            items: z.array(
              z.object({
                id: z.number().int(),
                purchase_order_id: z.number().int(),
                resource_id: z.number().int(),
                quantity: z.number(),
                unit_price: z.number(),
                total_price: z.number(),
                company_id: z.number().int(),
              })
            ),
  
            supplier: z.object({
              id: z.number().int(),
              name: z.string(),
              CNPJ: z.string(),
              phone: z.string(),
              email: z.string(),
              contactPerson: z.string(),
              notes: z.string(),
              addres_id: z.number().int(),
              company_id: z.number().int(),
            }),
          }),
        },
      },
    },
    getPurchaseOrdersById
  );

  app.get(
    "",
    {
      schema: {
        tags: ["purchase-orders"],
        description: "List All Purchase Orders",
        response: {
          200: z.array(
            z.object({
              id: z.number().int(),

              supplier_id: z.number(),
              status_id: z.number(),
              company_id: z.number(),
              total_value: z.number(),

              created_at: z.coerce.date(),
              updated_at: z.coerce.date(),

              supplier: z
                .object({
                  id: z.number().int(),
                  name: z.string(),
                  CNPJ: z.string(),
                  phone: z.string().nullable().optional(),
                  email: z.string().nullable().optional(),
                  contactPerson: z.string().nullable().optional(),
                  notes: z.string().nullable().optional(),
                  addres_id: z.number().int().nullable().optional(),
                  company_id: z.number().int(),
                })
                .nullable()
                .optional(),

              status: z
                .object({
                  id: z.number(),
                  name: z.string(),
                })
                .nullable()
                .optional(),

              items: z
                .array(
                  z.object({
                    id: z.number(),
                    quantity: z.number(),
                    unit_price: z.number(),
                    resource_id: z.number(),
                    resource: z
                      .object({
                        id: z.number(),
                        name: z.string(),
                        width: z.number().nullable().optional(),
                        height: z.number().nullable().optional(),
                        depth: z.number().nullable().optional(),
                        category: z
                          .object({
                            id: z.number(),
                            name: z.string(),
                          })
                          .nullable()
                          .optional(),
                      })
                      .nullable()
                      .optional(),
                  }),
                )
                .optional()
                .default([]),
            }),
          ),
        },
      },
    },
    getAllPurchaseOrders,
  );

  app.put(
    "/:id",
    {
      schema: {
        tags: ["purchase-orders"],
        description: "Update Purchase Orders",
        params: z.object({
          id: z.coerce.number(),
        }),
        body: purchaseOrdersUpdateBodySchema,
        response: {
          204: z.null().describe("purchase orders updated"),
        },
      },
    },
    updatePurchaseOrder
  );
}