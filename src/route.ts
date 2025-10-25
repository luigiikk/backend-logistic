import z from "zod";
import type { FastifyTypedInstance } from "./types.js";
import {registerProduct, productRegisterBodySchema,} from "./http/controllers/products/registerProduct.js";
import { getAllProducts } from "./http/controllers/products/getAllProduct.js";
import { getProduct } from "./http/controllers/products/getProduct.js";
import { deleteProduct } from "./http/controllers/products/deleteProduct.js";
import {registerStatus, statusRegisterBodySchema,} from "./http/controllers/status/registerStatus.js";
import { getAllStatus } from "./http/controllers/status/getAllStatus.js";
import { getStatus } from "./http/controllers/status/getStatus.js";
import { deleteStatus } from "./http/controllers/status/deleteStatus.js";




export async function routes(app: FastifyTypedInstance) {
  app.get(
    "/products",
    {
      schema: {
        tags: ["products"],
        description: "List products",
        response: {
          200: z.array(
            z.object({
              name: z.string(),
              description: z.string(),
              quantity: z.number().int(),
              order_id: z.number().int(),
            })
          ),
        },
      },
    },
    getAllProducts
  );

  app.get(
    "/product/:id",
    {
      schema: {
        tags: ["products"],
        description: "List unique product by id",
        params: z.object({
          id: z.coerce.number(),
        }),
        response: {
          200: z.object({
            name: z.string(),
            description: z.string(),
            quantity: z.number().int(),
            order_id: z.number().int(),
          }),
        },
      },
    },
    getProduct
  );

  app.post(
    "/product",
    {
      schema: {
        tags: ["products"],
        description: "Create new product",
        body: productRegisterBodySchema,
        response: {
          201: z.null().describe("Product created"),
        },
      },
    },
    registerProduct
  );

  app.delete(
    "/product/:id",
    {
      schema: {
        tags: ["products"],
        description: "Delete product by id",
        params: z.object({
          id: z.coerce.number(),
        }),
        response: {
          200: z.string(),
        },
      },
    },
    deleteProduct
  );
  app.get(
    "/status",
    {
      schema: {
        tags: ["status"],
        description: "List status",
        response: {
          200: z.array(
            z.object({
              name: z.string(),
              type: z.enum(["order", "vehicle", "invoice", "purchase_order"]),
              is_default: z.boolean().optional(),
              user_id: z.number().int(),
            })
          ),
        },
      },
    },
    getAllStatus
  );

  app.get(
    "/status/:id",
    {
      schema: {
        tags: ["status"],
        description: "List unique status by id",
        params: z.object({
          id: z.coerce.number(),
        }),
        response: {
          200: z.object({
            name: z.string(),
            type: z.enum(["order", "vehicle", "invoice", "purchase_order"]),
            is_default: z.boolean().optional(),
            user_id: z.number().int(),
          }),
        },
      },
    },
    getStatus
  );

  app.post(
    "/status",
    {
      schema: {
        tags: ["status"],
        description: "Create new status",
        body: statusRegisterBodySchema,
        response: {
          201: z.null().describe("Status created"),
        },
      },
    },
    registerStatus
  );

  app.delete(
    "/status/:id",
    {
      schema: {
        tags: ["status"],
        description: "Delete status by id",
        params: z.object({
          id: z.coerce.number(),
        }),
        response: {
          200: z.string(),
        },
      },
    },
    deleteStatus
  );
}