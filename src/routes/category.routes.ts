import type { FastifyTypedInstance } from "@/@types/types.js";
import { getAllCategory } from "@/http/controllers/resources/category-resources/getAllCategory.js";
import { getCategoryById } from "@/http/controllers/resources/category-resources/getCategoryById.js";
import z from "zod";

export async function categoryRoutes(app: FastifyTypedInstance) {
  app.get(
    "",
    {
      schema: {
        tags: ["category-resource"],
        description: "Get All categories",
        response: {
          201: z.array(
            z.object({
            id: z.number(),
            name: z.string(),
            description: z.string()
            })
          ),
        },
      },
    },
    getAllCategory
  );

  app.get(
    "/:id",
    {
      schema: {
        tags: ["category-resource"],
        description: "Get unique category",
        params: z.object({
          id: z.coerce.number(),
        }),
        response: {
          201: 
            z.object({
              id: z.number(),
              name: z.string(),
              description: z.string()
            })
        },
      },
    },
    getCategoryById
  );
}