import type { FastifyTypedInstance } from "@/@types/types.js";
import { deleteStatus } from "@/http/controllers/status/deleteStatus.js";
import { getAllStatusByCompany } from "@/http/controllers/status/getAllStatusByCompany.js";
import { getStatus } from "@/http/controllers/status/getStatus.js";
import { registerStatus, statusRegisterBodySchema } from "@/http/controllers/status/registerStatus.js";
import { statusUpdateBodySchema, updateStatus } from "@/http/controllers/status/updateStatus.js";
import z from "zod";



export async function statusRoutes(app: FastifyTypedInstance) {
  app.get(
    "",
    {
      schema: {
        tags: ["status"],
        description: "List status",
        response: {
          200: z.array(
            z.object({
              name: z.string(),
              type: z.enum(["order", "vehicle", "invoice", "purchase_order"]),
              is_default: z.boolean().optional(),
            })
          ),
        },
      },
    },
    getAllStatusByCompany
  );
  
  app.get(
    "/status/:id",
    {
      schema: {
        tags: ["status"],
        description: "List unique status by id",
        params: z.object({
          id: z.coerce.number(),
        }),
        response: {
          200: z.object({
            name: z.string(),
            type: z.enum(["order", "vehicle", "invoice", "purchase_order"]),
            is_default: z.boolean().optional(),
          }),
        },
      },
    },
    getStatus
  );
  
  app.post(
    "",
    {
      schema: {
        tags: ["status"],
        description: "Create new status",
        body: statusRegisterBodySchema,
        response: {
          201: z.null().describe("Status created"),
        },
      },
    },
    registerStatus
  );
  
  app.delete(
    "/:id",
    {
      schema: {
        tags: ["status"],
        description: "Delete status by id",
        params: z.object({
          id: z.coerce.number(),
        }),
        response: {
          200: z.string(),
        },
      },
    },
    deleteStatus
  );
  
  app.put(
    "/:id",
    {
      schema: {
        tags: ["status"],
        description: "Update status",
        body: statusUpdateBodySchema,
        response: {
          204: z.null().describe("update status"),
        },
      },
    },
    updateStatus
  );
  
}

