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
            id: z.number(),
            name: z.string().nullable(),
            email: z.string().nullable(),
            phone: z.string().nullable(),
            CNPJ: z.string().nullable(),
            contactPerson: z.string().nullable(),
            notes: z.string().nullable(),
            addres_id: z.number().nullable(),
            company_id: z.number(),
            created_at: z.coerce.date(),
            updated_at: z.coerce.date(),
            address: z.object({
              id: z.number(),
              street: z.string().nullable(),
              number: z.number().nullable(),
              city: z.string().nullable(),
              state: z.string().nullable(),
              complement: z.string().nullable(),
              zipcode: z.string().nullable(),
              country: z.string().nullable(),
              created_at: z.coerce.date(),
              updated_at: z.coerce.date(),
            }).nullable(),
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
          200: z.object({
            id: z.number(),
            name: z.string(),
            email: z.string().email(),
            phone: z.string(),
            CNPJ: z.string(),
            contactPerson: z.string().nullable().optional(),
            notes: z.string().nullable().optional(),
            
            address: z.object({
              street: z.string().nullable().optional(),
              number: z.number().nullable().optional(),
              city: z.string().nullable().optional(),
              state: z.string().nullable().optional(),
              complement: z.string().nullable().optional(),
              zipcode: z.string().nullable().optional(),
            }).nullable().optional(),
          }),
        },
      },
    },
    getSupplierById
  );
}