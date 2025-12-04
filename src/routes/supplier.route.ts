import type { FastifyTypedInstance } from "@/@types/types.js";
import { registerSupplier, supplierRegisterBodySchema } from "@/http/controllers/supplier/registerSupplier.js";
import { supplierUpdateBodySchema, updateSupplier } from "@/http/controllers/supplier/updateSupplier.js";
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

  app.put(
    "/:id",
    {
      schema: {
        tags: ["companies"],
        description: "Update company",
        body: supplierUpdateBodySchema,
        response: {
          204: z.null().describe("company updated"),
        },
      },
    },
    updateSupplier
  );
}