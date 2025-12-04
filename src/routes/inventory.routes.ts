import type { FastifyTypedInstance } from "@/@types/types.js";
import { getInventoryByResourceId } from "@/http/controllers/inventory/inventory-by-resourceId.js";
import { getInventoryByWarehouseId } from "@/http/controllers/inventory/inventory-by-warehouseId.js";
import { InventoryDispatch, inventoryDispatchBodySchema } from "@/http/controllers/inventory/inventory-dispatch.js";
import { inventoryRegister, inventoryRegisterBodySchema } from "@/http/controllers/inventory/inventory-register.js";
import { inventoryTransfer, inventoryTransferBodySchema } from "@/http/controllers/inventory/inventory-transfer.js";
import z from "zod";



export async function inventoryRoutes(app: FastifyTypedInstance) {
  app.post(
    "/inventory/receive",
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
    "resource/:resourceId",
    {
      schema: {
        tags: ["inventory"],
        description: "Get inventory by resource id",
        params: z.object({
          resourceId: z.coerce.number(),
        }),
        response: {
          200: z.array(
            z.object({
              id: z.number().int(),
              resource_name: z.string(),
              warehouse_name: z.string(),
              quantity: z.number(),
            })
          ),
        }
      },
    },
    getInventoryByResourceId
  );

  app.get(
    "/warehouse/:warehouseId",
    {
      schema: {
        tags: ["inventory"],
        description: "Get inventory by warehouse id",
        params: z.object({
          warehouseId: z.coerce.number(),
        }),
        response: {
          200: z.array(
            z.object({
              id: z.number().int(),
              resource_name: z.string(),
              warehouse_name: z.string(),
              quantity: z.number(),
            })
          ),
        },
      },
    },
    getInventoryByWarehouseId
  );
}