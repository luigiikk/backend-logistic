import type { FastifyTypedInstance } from "@/@types/types.js";
import { deleteProduct } from "@/http/controllers/products/deleteProduct.js";
import { getAllProducts } from "@/http/controllers/products/getAllProduct.js";
import { getProduct } from "@/http/controllers/products/getProduct.js";
import { productRegisterBodySchema, registerProduct } from "@/http/controllers/products/registerProduct.js";
import z from "zod";



export async function productRoutes(app: FastifyTypedInstance) {
  app.get(
    "",
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
    ":id",
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
    "",
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
    "/:id",
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
}