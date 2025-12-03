import type { FastifyTypedInstance } from "@/@types/types.js";
import { authCompany, companyAuthBodySchema } from "@/http/controllers/company/authCompany.js";
import { deleteCompany } from "@/http/controllers/company/deleteCompany.js";
import { getAllCompanies } from "@/http/controllers/company/getAllCompany.js";
import { getCompany } from "@/http/controllers/company/getCompany.js";
import { companyRegisterBodySchema, registerCompany } from "@/http/controllers/company/register.js";
import { companyUpdateBodySchema, updateCompany } from "@/http/controllers/company/updateCompany.js";
import { verifyRole } from "@/http/middleware/verifyRole.js";
import z from "zod";

export async function companyRoutes(app: FastifyTypedInstance) {
  app.get(
    "",
    {
      preHandler: [verifyRole(["admin"])],
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
    "/:id",
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
    "",
    {
      schema: {
        tags: ["companies"],
        description: "Create new company",
        body: companyRegisterBodySchema,
        response: {
          201: z.null().describe("Company created"),
        },
      },
    },
    registerCompany
  );

  app.delete(
    "/:id",
    {
      preHandler: [verifyRole(["admin"])],
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
    "/:id",
    {
      preHandler: [verifyRole(["company", "admin"])],
      schema: {
        tags: ["companies"],
        description: "Update company",
        body: companyUpdateBodySchema,
        response: {
          204: z.null().describe("company auth"),
        },
      },
    },
    updateCompany
  );

  app.post(
    "/auth",
    {
      schema: {
        tags: ["companies"],
        description: "Auth company",
        body: companyAuthBodySchema,
        response: {
          200: z.object({ token: z.string() }),
        },
      },
    },
    authCompany
  );
}