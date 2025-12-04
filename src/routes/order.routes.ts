import type { FastifyTypedInstance } from "@/@types/types.js";
import { deleteOrder } from "@/http/controllers/order/deleteOrder.js";
import { getAllOrdersByCompany } from "@/http/controllers/order/getAllOrdersByCompany.js";
import { getOrder } from "@/http/controllers/order/getOrder.js";
import { orderRegisterByClientBodySchema, registerOrder } from "@/http/controllers/order/registerOrder.js";
import { orderUpdateBodySchema, updateOrder } from "@/http/controllers/order/updateOrder.js";
import z from "zod";



export async function orderRoutes(app: FastifyTypedInstance) {
  app.get(
    "/:id",
    {
      schema: {
        tags: ["order"],
        description: "Get order by id",
        params: z.object({
          id: z.coerce.number(),
        }),
        response: {
          200: z.object({
            code: z.string(),
            sender_client: z.string(),
            recipient: z.string(),
            status: z.string(),
            vehicle: z.string(),
          }),
        },
      },
    },
    getOrder
  );

  app.get(
    "",
    {
      schema: {
        tags: ["order"],
        description: "List all orders",
        response: {
          200: z.array(
            z.object({
              code: z.string(),
              sender_client: z.string(),
              recipient: z.string(),
              status: z.string(),
              vehicle: z.string(),
            })
          ),
        },
      },
    },
    getAllOrdersByCompany
  );

  app.post(
    "/client",
    {
      schema: {
        tags: ["order"],
        description: "Create new order by client",
        body: orderRegisterByClientBodySchema,
        response: {
          201: z.null().describe("Order created"),
        },
      },
    },
    registerOrder
  );

  app.put(
    "/:id",
    {
      schema: {
        tags: ["order"],
        description: "Update order info",
        params: z.object({
          id: z.coerce.number(),
        }),
        body: orderUpdateBodySchema,
        response: {
          204: z.null().describe("Order updated"),
        },
      },
    },
    updateOrder
  );

  app.delete(
    "/:id",
    {
      schema: {
        tags: ["order"],
        description: "Delete order by id",
        params: z.object({
          id: z.coerce.number(),
        }),
        response: {
          200: z.string().describe("Order deleted"),
        },
      },
    },
    deleteOrder
  );
}