import type { FastifyTypedInstance } from "@/@types/types.js";
import { getAllCategory } from "@/http/controllers/resources/category-resources/getAllCategory.js";
import { getCategoryById } from "@/http/controllers/resources/category-resources/getCategoryById.js";
import { CategorySchema } from "@/schemas/category.schema.js";
import z from "zod";

export async function categoryRoutes(app: FastifyTypedInstance) {
  app.get(
    "",
    {
      schema: {
        tags: ["category-resource"],
        description: "Get All categories",
        response: {
          201: z.array(CategorySchema),
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
          201: CategorySchema
        },
      },
    },
    getCategoryById
  );
}