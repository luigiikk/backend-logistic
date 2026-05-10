import type { FastifyTypedInstance } from "@/@types/types.js";
import { getOrderTrackingHistoryByOrderId } from "@/http/controllers/order/tracking/getOrderTrackingHistoryByOrder.js";
import { getPublicTracking } from "@/http/controllers/order/tracking/getPublicTracking.js";
import { orderTrackingParamsSchema, orderTrackingRegisterBodySchema, registerOrderTracking } from "@/http/controllers/order/tracking/registerOrderTracking.js";
import z from "zod";



export async function orderTrackingRoutes(app: FastifyTypedInstance) {

  app.post(
    "/orders/:id/tracking",
    {
      schema: {
        tags: ["order-tracking"],
        description: "Create new order tracking",
        params: orderTrackingParamsSchema,
        body: orderTrackingRegisterBodySchema,
        response: {
          201: z.null().describe("new Order Tracking created"),
        },
      },
    },
    registerOrderTracking
  );

  app.get(
    "/orders/:id/tracking",
    {
      schema: {
        tags: ["order-tracking"],
        description: "List order tracking by order id",
  
        params: orderTrackingParamsSchema,
  
        response: {
          200: z.object({
            order: z.object({
              id: z.number(),
              code: z.string().nullable(),
              status: z.string(),
            }),
  
            tracking: z.array(
              z.object({
                id: z.number(),
  
                location: z.string().nullable(),
  
                description: z.string().nullable(),
  
                estimated_delivery: z.string().datetime().nullable(),
  
                occurred_at: z.string().datetime(),
  
                status: z
                  .object({
                    id: z.number(),
                    name: z.string(),
                  })
                  .nullable(),
              })
            ),
          }),
        },
      },
    },
    getOrderTrackingHistoryByOrderId
  );

  app.get(
    "/tracking",
    {
      schema: {
        tags: ["public-tracking"],
        description: "Get public order tracking",
        querystring: z.object({
          code: z.string().min(3),

          cpf: z.string().min(11),
        }),
        response: {
          200: z.object({
            order: z.object({
              id: z.number(),
              code: z.string().nullable(),
  
              status: z.object({
                id: z.number(),
                name: z.string(),
              }),
            }),
  
            tracking: z.array(
              z.object({
                id: z.number(),
  
                location: z.string().nullable(),
  
                description: z.string().nullable(),
  
                estimated_delivery: z.string().datetime().nullable(),
  
                occurred_at: z.string().datetime(),
              })
            ),
          }),
        },
      },
    },
    getPublicTracking
  );
}