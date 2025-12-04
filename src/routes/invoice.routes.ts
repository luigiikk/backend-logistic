import type { FastifyTypedInstance } from "@/@types/types.js";
import { getInventoryByResourceId } from "@/http/controllers/inventory/inventory-by-resourceId.js";
import { deleteInvoice } from "@/http/controllers/invoice/deleteInvoice.js";
import { getInvoice } from "@/http/controllers/invoice/getInvoice.js";
import { invoiceRegisterBodySchema, registerInvoice } from "@/http/controllers/invoice/registerInvoice.js";
import { invoiceUpdateBodySchema, updateInvoice } from "@/http/controllers/invoice/updateInvoice.js";
import z from "zod";



export async function invoiceRoutes(app: FastifyTypedInstance) {
  app.get(
    "/:id",
    {
      schema: {
        tags: ["invoice"],
        description: "Get invoice by id",
        params: z.object({
          id: z.coerce.number(),
        }),
        response: {
          200: z.object({
            client_id: z.number().int(),
            invoice_number: z.number().int(),
            issue_date: z.coerce.date(),
            due_date: z.coerce.date(),
            total_amount: z.number(),
            tax_amount: z.number(),
            status_id: z.number(),
            link_file: z.string(),
          }),
        },
      },
    },
    getInvoice
  );

  app.get(
    "",
    {
      schema: {
        tags: ["invoice"],
        description: "List all invoices",
        response: {
          200: z.array(
            z.object({
              client_id: z.number().int(),
              invoice_number: z.number().int(),
              issue_date: z.coerce.date(),
              due_date: z.coerce.date(),
              total_amount: z.number(),
              tax_amount: z.number(),
              status_id: z.number(),
              link_file: z.string(),
            })
          ),
        },
      },
    },
    getInventoryByResourceId
  );

  app.post(
    "",
    {
      schema: {
        tags: ["invoice"],
        description: "Create new invoice",
        body: invoiceRegisterBodySchema,
        response: {
          201: z.null().describe("Invoice created"),
        },
      },
    },
    registerInvoice
  );

  app.put(
    "/:id",
    {
      schema: {
        tags: ["invoice"],
        description: "Update invoice info",
        params: z.object({
          id: z.coerce.number(),
        }),
        body: invoiceUpdateBodySchema,
        response: {
          204: z.null().describe("Invoice updated"),
        },
      },
    },
    updateInvoice
  );

  app.delete(
    "/:id",
    {
      schema: {
        tags: ["invoice"],
        description: "Delete invoice by id",
        params: z.object({
          id: z.coerce.number(),
        }),
        response: {
          200: z.string().describe("Invoice deleted"),
        },
      },
    },
    deleteInvoice
  );

}