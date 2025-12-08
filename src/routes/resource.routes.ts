import type { FastifyTypedInstance } from "@/@types/types.js";
import { getAllResource } from "@/http/controllers/resources/getAllResource.js";
import { resourceRegister, resourceRegisterBodySchema } from "@/http/controllers/resources/registerResource.js";
import z from "zod";



export async function resourceRoutes(app: FastifyTypedInstance) {
  app.post(
    "",
    {
      schema: {
        tags: ["resource"],
        description: "Create new resource",
        body: resourceRegisterBodySchema,
        response: {
          201: z.null().describe("Resource created"),
        },
      },
    },
    resourceRegister
  );

  app.get(
    "",
    {
      schema: {
        tags: ["resource"],
        description: "Get All resource",
        response: {
          201: z.array(
            z.object({
              id: z.number(),
              name: z.string(),
              description: z.string(),
              quantity: z.number(),
              category_id: z.object({
                id: z.number(),
                name: z.string(),
                description: z.string()
              })
            })
          ),
        },
      },
    },
    getAllResource
  );
}