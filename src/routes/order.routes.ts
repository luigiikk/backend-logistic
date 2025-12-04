import type { FastifyTypedInstance } from "@/@types/types.js";
import { deleteOrder } from "@/http/controllers/order/deleteOrder.js";
import { getAllOrdersByCompany } from "@/http/controllers/order/getAllOrdersByCompany.js";
import { getOrder } from "@/http/controllers/order/getOrder.js";
import { orderRegisterByClientBodySchema, registerOrderByClient } from "@/http/controllers/order/registerOrderByClient.js";
import { orderRegisterByCompanyBodySchema, registerOrderByCompany } from "@/http/controllers/order/registerOrderByCompany.js";
import { orderUpdateByCompanyBodySchema, updateOrderByCompany } from "@/http/controllers/order/updateOrderByCompany.js";
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
    registerOrderByClient
  );

  app.post(
    "/company",
    {
      schema: {
        tags: ["order"],
        description: "Create new order by client",
        body: orderRegisterByCompanyBodySchema,
        response: {
          201: z.null().describe("Order created"),
        },
      },
    },
    registerOrderByCompany
  );

  app.put(
    "/:orderId",
    {
      schema: {
        tags: ["order"],
        description: "Update order info",
        params: z.object({
          id: z.coerce.number(),
        }),
        body: orderUpdateByCompanyBodySchema,
        response: {
          204: z.null().describe("Order updated"),
        },
      },
    },
    updateOrderByCompany
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