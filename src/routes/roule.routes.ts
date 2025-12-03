import type { FastifyTypedInstance } from "@/@types/types.js";
import { getAllRoles } from "@/http/controllers/role/getAllRoles.js";
import z from "zod";

export async function roulesRoutes(app: FastifyTypedInstance) {
  app.get(
    "",
    {
      schema: {
        tags: ["roles"],
        description: "List all roles",
        response: {
          200: z.array(
            z.object({
              id: z.number().int(),
              name: z.string(),
            })
          ),
        },
      },
    },
    getAllRoles
  );
}


