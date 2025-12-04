import type { FastifyTypedInstance } from "@/@types/types.js";
import { categoryRegister, categoryRegisterBodySchema } from "@/http/controllers/resources/category-resources/registerCategory.js";
import z from "zod";

export async function categoryRoutes(app: FastifyTypedInstance) {
  app.post(
    "",
    {
      schema: {
        tags: ["category-resource"],
        description: "Create new category for resource",
        body: categoryRegisterBodySchema,
        response: {
          201: z.null().describe("Category created"),
        },
      },
    },
    categoryRegister
  );
}