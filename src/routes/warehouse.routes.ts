import type { FastifyTypedInstance } from "@/@types/types.js";
import { warehousesRegister, warehousesRegisterBodySchema } from "@/http/controllers/warehouses/registerWarehouses.js";
import { getAllWarehouse } from "@/http/controllers/warehouses/getAllWarehouses.js";
import { getWarehouseById } from "@/http/controllers/warehouses/getWarehouseById.js";
import { updateWarehouse, updateWarehouseBodySchema } from "@/http/controllers/warehouses/updateWarehouse.js";
import { deleteWarehouse } from "@/http/controllers/warehouses/deleteWarehouse.js";
import z from "zod";



export async function warehouseRoutes(app: FastifyTypedInstance) {
  app.post(
    "",
    {
      schema: {
        tags: ["warehouses"],
        description: "Create new warehouses",
        body: warehousesRegisterBodySchema,
        response: {
          201: z.null().describe("Warehouses created"),
        },
      },
    },
    warehousesRegister
  );

app.get(
  "",
  {
    schema: {
      tags: ["warehouses"],
      description: "List all warehouses for the company",
      response: {
        200: z.array(
          z.object({
            id: z.number(),
            name: z.string().nullable(),
            company_id: z.number(),
            addres_id: z.number().nullable(),
            total_volume: z.number().nullable(),
            used_volume: z.number(),
            available_volume: z.number(),
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
  getAllWarehouse
);

  app.get(
    "/:id",
    {
      schema: {
        tags: ["warehouses"],
        description: "Get a warehouse by ID",
        security: [{ jwt: [] }],
        params: z.object({
          id: z.string().or(z.number()), 
        }),
      },
    },
    getWarehouseById
  );

  app.put(
    "/:id",
    {
      schema: {
        tags: ["warehouses"],
        description: "Update a warehouse",
        security: [{ jwt: [] }],
        params: z.object({
          id: z.string().or(z.number()),
        }),
        body: updateWarehouseBodySchema, 
        response: {
          200: z.object({
            message: z.string(),
          }),
        },
      },
    },
    updateWarehouse
  );

  app.delete(
    "/:id",
    {
      schema: {
        tags: ["warehouses"],
        description: "Delete a warehouse",
        security: [{ jwt: [] }],
        params: z.object({
          id: z.string().or(z.number()),
        }),
        response: {
          200: z.object({
            message: z.string(),
          }),
        },
      },
    },
    deleteWarehouse
  );
}