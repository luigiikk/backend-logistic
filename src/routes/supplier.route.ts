import type { FastifyTypedInstance } from "@/@types/types.js";
import { getAllSupplierByCompany } from "@/http/controllers/supplier/getAllSupplierByCompany.js";
import { getSupplierById } from "@/http/controllers/supplier/getSupplierById.js";
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
        tags: ["supplier"],
        description: "Update company",
        body: supplierUpdateBodySchema,
        response: {
          204: z.null().describe("company updated"),
        },
      },
    },
    updateSupplier
  );

  app.get(
    "",
    {
      schema: {
        tags: ["supplier"],
        description: "List supplier by company",
        response: {
          200: z.array(
            z.object({
              name: z.string(),
              email: z.string().email(),
              phone: z.string(),
              CNPJ: z.string(),
              contactPerson: z.string(),
              notes: z.string(),
              address: z.object({
                street: z.string().nullable().optional(),
                number: z.number().nullable().optional(),
                city: z.string().nullable().optional(),
                state: z.string().nullable().optional(),
                complement: z.string().nullable().optional(),
                zipcode: z.string().nullable().optional(),
              }),
            })
          ),
        },
      },
    },
    getAllSupplierByCompany
  );

  app.get(
    "/:id",
    {
      schema: {
        tags: ["supplier"],
        description: "List supplier by id",
        params: z.object({
          id: z.coerce.number(),
        }),
        response: {
          200:
            z.object({
              name: z.string(),
              email: z.string().email(),
              phone: z.string(),
              CNPJ: z.string(),
              contactPerson: z.string(),
              notes: z.string(),
              address: z.object({
                street: z.string().nullable().optional(),
                number: z.number().nullable().optional(),
                city: z.string().nullable().optional(),
                state: z.string().nullable().optional(),
                complement: z.string().nullable().optional(),
                zipcode: z.string().nullable().optional(),
              }),
            })
        },
      },
    },
    getSupplierById
  );
}