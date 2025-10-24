import z from "zod";
import type { FastifyTypedInstance } from "./types.js";
import {companyRegisterBodySchema,register,} from "./http/controllers/register.js";
import { getCompany } from "./http/controllers/getCompany.js";
import { getAllCompanies } from "./http/controllers/getAllCompany.js";
import { deleteCompany } from "./http/controllers/deleteCompany.js";
import {companyUpdateBodySchema,updateCompany,} from "./http/controllers/updateCompany.js";
import {registerProduct,productRegisterBodySchema,} from "./http/controllers/products/registerProduct.js";
import { getAllProducts } from "./http/controllers/products/getAllProduct.js";
import { getProduct } from "./http/controllers/products/getProduct.js";
import { deleteProduct } from "./http/controllers/products/deleteProduct.js";
import {registerStatus,statusRegisterBodySchema,} from "./http/controllers/status/registerStatus.js";
import { getAllStatus } from "./http/controllers/status/getAllStatus.js";
import { getStatus } from "./http/controllers/status/getStatus.js";
import { deleteStatus } from "./http/controllers/status/deleteStatus.js";

export async function routes(app: FastifyTypedInstance) {
  app.get(
    "/company",
    {
      schema: {
        tags: ["companies"],
        description: "List companies",
        response: {
          200: z.array(
            z.object({
              name: z.string(),
              email: z.email(),
              phone_number: z.string(),
              cnpj: z.string(),
            })
          ),
        },
      },
    },
    getAllCompanies
  );

  app.get(
    "/company/:id",
    {
      schema: {
        tags: ["companies"],
        description: "List unique company by id",
        params: z.object({
          id: z.coerce.number(),
        }),
        response: {
          200: z.object({
            name: z.string(),
            email: z.email(),
            phone_number: z.string(),
            cnpj: z.string(),
          }),
        },
      },
    },
    getCompany
  );

  app.post(
    "/company",
    {
      schema: {
        tags: ["users"],
        description: "Create new company",
        body: companyRegisterBodySchema,
        response: {
          201: z.null().describe("Company created"),
        },
      },
    },
    register
  );

  app.delete(
    "/company/:id",
    {
      schema: {
        tags: ["companies"],
        description: "Delete company by id",
        params: z.object({
          id: z.coerce.number(),
        }),
        response: {
          200: z.string(),
        },
      },
    },
    deleteCompany
  );

  app.put(
    "/company/:id",
    {
      schema: {
        tags: ["companies"],
        description: "Update company",
        params: z.object({
          id: z.coerce.number(),
        }),
        body: companyUpdateBodySchema,
        response: {
          204: z.null().describe("company Updated"),
        },
      },
    },
    updateCompany
  );

  app.get(
    "/products",
    {
      schema: {
        tags: ["products"],
        description: "List products",
        response: {
          200: z.array(
            z.object({
              name: z.string(),
              description: z.string(),
              quantity: z.number().int(),
              order_id: z.number().int(),
            })
          ),
        },
      },
    },
    getAllProducts
  );

  app.get(
    "/product/:id",
    {
      schema: {
        tags: ["products"],
        description: "List unique product by id",
        params: z.object({
          id: z.coerce.number(),
        }),
        response: {
          200: z.object({
            name: z.string(),
            description: z.string(),
            quantity: z.number().int(),
            order_id: z.number().int(),
          }),
        },
      },
    },
    getProduct
  );

  app.post(
    "/product",
    {
      schema: {
        tags: ["products"],
        description: "Create new product",
        body: productRegisterBodySchema,
        response: {
          201: z.null().describe("Product created"),
        },
      },
    },
    registerProduct
  );

  app.delete(
    "/product/:id",
    {
      schema: {
        tags: ["products"],
        description: "Delete product by id",
        params: z.object({
          id: z.coerce.number(),
        }),
        response: {
          200: z.string(),
        },
      },
    },
    deleteProduct
  );
  app.get(
    "/status",
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
              company_id: z.number().int(),
            })
          ),
        },
      },
    },
    getAllStatus
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
            company_id: z.number().int(),
          }),
        },
      },
    },
    getStatus
  );

  app.post(
    "/status",
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
    "/status/:id",
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
}
