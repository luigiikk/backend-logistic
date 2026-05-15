import type { FastifyTypedInstance } from "@/@types/types.js";
import { getAllResource } from "@/http/controllers/resources/getAllResource.js";
import { getResourceById } from "@/http/controllers/resources/getResourceById.js";
import { resourceRegister, resourceRegisterBodySchema } from "@/http/controllers/resources/registerResource.js";
import { updateResource, updateResourceBodySchema } from "@/http/controllers/resources/updateResource.js";
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
          200: z.array(
            z.object({
              id: z.number(),
              name: z.string(),
              description: z.string(),
              category_id: z.number(),
              width: z.number(),
              height: z.number(),
              depth: z.number(),

              category: z.object({
                id: z.number(),
                name: z.string(),
                description: z.string(),
              }),
            }),
          ),
        },
      },
    },
    getAllResource
  );

  app.get(
    "/:id",
    {
      schema: {
        tags: ["resource"],
        description: "Get unique resource",
        params: z.object({
          id: z.coerce.number(),
        }),
        response: {
          201: 
            z.object({
              id: z.number(),
              name: z.string(),
              description: z.string(),
              category_id: z.object({
                id: z.number(),
                name: z.string(),
                description: z.string()
              })
            })
        },
      },
    },
    getResourceById
  );

  app.put(
    "/:id",
    {
      schema: {
        tags: ["resource"],
        description: "Update resource",
        params: z.object({
          id: z.coerce.number(),
        }),
        body: updateResourceBodySchema,
        response: {
          204: z.null().describe("purchase orders updated"),
        },
      },
    },
    updateResource
  );
}