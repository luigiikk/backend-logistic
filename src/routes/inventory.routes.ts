import type { FastifyTypedInstance } from "@/@types/types.js";
import { getAllInventory } from "@/http/controllers/inventory/getAllInventory.js";
import { getInventoryById } from "@/http/controllers/inventory/inventory-by-id.js";
import { InventoryDispatch, inventoryDispatchBodySchema } from "@/http/controllers/inventory/inventory-dispatch.js";
import { inventoryRegister, inventoryRegisterBodySchema } from "@/http/controllers/inventory/inventory-register.js";
import { inventoryTransfer, inventoryTransferBodySchema } from "@/http/controllers/inventory/inventory-transfer.js";
import z from "zod";



export async function inventoryRoutes(app: FastifyTypedInstance) {
  app.post(
    "/receive",
    {
      schema: {
        tags: ["inventory"],
        description: "Receive Inventory",
        body: inventoryRegisterBodySchema,
        response: {
          201: z.null().describe("Inventory received"),
        },
      },
    },
    inventoryRegister
  );

  app.post(
    "/dispatch",
    {
      schema: {
        tags: ["inventory"],
        description: "Dispatch Inventory",
        body: inventoryDispatchBodySchema,
        response: {
          201: z.null().describe("Inventory dispatched"),
        },
      },
    },
    InventoryDispatch
  );

  app.post(
    "/transfer",
    {
      schema: {
        tags: ["inventory"],
        description: "Transfer Inventory",
        body: inventoryTransferBodySchema,
        response: {
          201: z.null().describe("Inventory transferred"),
        },
      },
    },
    inventoryTransfer
  );

  app.get(
    "/:id",
    {
      schema: {
        tags: ["inventory"],
        description: "Get inventory by id",
        params: z.object({
          id: z.coerce.number(),
        }),
        response: {
          200: z.array(
            z.object({
              id: z.number().int(),
              resource_id: z.number(),
              warehouse_id: z.number(),
              quantity: z.number(),
              company_id: z.number(),
            
        
              resource: z.object({
                id: z.number(),
                name: z.string(),
                description: z.string(),
                quantity: z.number(),
                category_id: z.number(),
                company_id: z.number(),
               
              }),
        
              warehouse: z.object({
                id: z.number(),
                name: z.string(),
                addres_id: z.number(),
                company_id: z.number(),
               
              }),
            })
          ),
        }
      },
    },
    getInventoryById
  );

 app.get(
  "",
  {
    schema: {
      tags: ["inventory"],
      description: "Get all inventory",
      response: {
        200: z.array(
          z.object({
            id: z.number().int(),
            resource_id: z.number(),
            warehouse_id: z.number().nullable(),
            quantity: z.number().nullable(),
            company_id: z.number(),

            resource: z.object({
              id: z.number(),
              name: z.string().nullable(),
              description: z.string().nullable(),
              category_id: z.number().nullable(),
              company_id: z.number(),
              category: z.object({
                id: z.number(),
                name: z.string().nullable(),
              }).nullable().optional(),
            }),

            warehouse: z.object({
              id: z.number(),
              name: z.string().nullable(),
              addres_id: z.number().nullable(),
              company_id: z.number(),
            }).nullable(),
          })
        ),
      }
    },
  },
  getAllInventory
);
}