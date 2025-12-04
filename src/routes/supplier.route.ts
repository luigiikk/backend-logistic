import type { FastifyTypedInstance } from "@/@types/types.js";
import { registerSupplier, supplierRegisterBodySchema } from "@/http/controllers/supplier/registerSupplier.js";
import z from "zod";



export async function supplierRoutes(app: FastifyTypedInstance) {
  app.post(
    "",
    {
      schema: {
        tags: ["supplier"],
        description: "Create new supplier",
        body: supplierRegisterBodySchema,
        response: {
          201: z.null().describe("Supplier created"),
        },
      },
    },
    registerSupplier
  );
}