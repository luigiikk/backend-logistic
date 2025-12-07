import type { FastifyTypedInstance } from "@/@types/types.js";
import { getInventoryByResourceId } from "@/http/controllers/inventory/inventory-by-resourceId.js";
import { deleteInvoice } from "@/http/controllers/invoice/deleteInvoice.js";
import { getAllInvoices } from "@/http/controllers/invoice/getAllInvoices.js";
import { getInvoice } from "@/http/controllers/invoice/getInvoice.js";
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
            id: z.number().int(),
            invoice_number: z.number().nullable(),
            purchase_order_id: z.number().int(),
            company_id: z.number().int(),
            issue_date: z.coerce.date(),
            due_date: z.coerce.date().nullable(),
            link_file: z.string().nullable(),
            created_at: z.coerce.date(),
            updated_at: z.coerce.date(),
        
            purchase_order: z.object({
              id: z.number().int(),
              supplier_id: z.number().int(),
              status_id: z.number().int(),
              total_value: z.number(),
              company_id: z.number().int(),
              created_at: z.coerce.date(),
              updated_at: z.coerce.date()
            })
          })
        }
      },
    },
    getInvoice
  );

  app.put(
    "/:id",
    {
      schema: {
        tags: ["invoice"],
        description: "Get invoice by id",
        params: z.object({
          id: z.coerce.number(),
        }),
        body: invoiceUpdateBodySchema,
        response: {
          204: z.null().describe("invoice updated"),
        },
      },
    },
    updateInvoice
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
              id: z.number().int(),
              invoice_number: z.number().nullable(),
              purchase_order_id: z.number().int(),
              company_id: z.number().int(),
              issue_date: z.coerce.date(),
              due_date: z.coerce.date().nullable(),
              link_file: z.string().nullable(),
              created_at: z.coerce.date(),
              updated_at: z.coerce.date(),
          
              purchase_order: z.object({
                id: z.number().int(),
                supplier_id: z.number().int(),
                status_id: z.number().int(),
                total_value: z.number(),
                company_id: z.number().int(),
                created_at: z.coerce.date(),
                updated_at: z.coerce.date()
              })
            })
          )
        }
      },
    },
    getAllInvoices
  );
}