import type { FastifyTypedInstance } from "@/@types/types.js";
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
}