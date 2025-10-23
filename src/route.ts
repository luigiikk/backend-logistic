import z from "zod";
import type { FastifyTypedInstance } from "./types.js";
import { companyRegisterBodySchema, register } from "./http/controllers/register.js";
import { getCompany } from "./http/controllers/getCompany.js";
import { getAllCompanies } from "./http/controllers/getAllCompany.js";
import { deleteCompany } from "./http/controllers/deleteCompany.js";
import { companyUpdateBodySchema, updateCompany } from "./http/controllers/updateCompany.js";


export async function routes(app: FastifyTypedInstance) {
  app.get('/company', {
    schema: {
      tags: ['companies'],
      description: 'List companies',
      response: {
        200: z.array(z.object({
          name: z.string(),
          email: z.email(),
          phone_number: z.string(),
          cnpj: z.string(),
        }))
      }
    }
  }, getAllCompanies);

  app.get('/company/:id', {
    schema: {
      tags: ['companies'],
      description: 'List unique company by id',
      params: z.object({
        id:  z.coerce.number()
      }),
      response: {
        200: z.object({
          name: z.string(),
          email: z.email(),
          phone_number: z.string(),
          cnpj: z.string(),
        })
      }
    }
  }, getCompany);
  
  app.post('/company', {
    schema: {
      tags: ['users'],
      description: 'Create new company',
      body: companyRegisterBodySchema,
      response: {
        201: z.null().describe('Company created')
      }
    }
  }, register)

  app.delete('/company/:id', {
    schema: {
      tags: ['companies'],
      description: 'Delete company by id',
      params: z.object({
        id:  z.coerce.number()
      }),
      response: {
        200: z.string(),
      }
    }
  }, deleteCompany)

  app.put('/company/:id', {
    schema: {
      tags: ['companies'],
      description: 'Update company',
      params: z.object({
        id:  z.coerce.number()
      }),
      body: companyUpdateBodySchema,
      response: {
        204: z.null().describe('company Updated')
      }      
    }
  }, updateCompany)
}
