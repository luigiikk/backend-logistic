import type { FastifyTypedInstance } from "@/@types/types.js";
import { authEmployee, employeeAuthBodySchema } from "@/http/controllers/employees/authEmployee.js";
import { deleteEmployee } from "@/http/controllers/employees/deleteEmployee.js";
import { getAllEmployeesByName } from "@/http/controllers/employees/getAllEmployeeByName.js";
import { getAllEmployeesByCompany } from "@/http/controllers/employees/getAllEmployeesByCompany.js";
import { getEmployee } from "@/http/controllers/employees/getEmployee.js";
import { employeeRegisterBodySchema, registerEmployee } from "@/http/controllers/employees/registerEmployee.js";
import { employeeUpdateBodySchema, updateEmployee } from "@/http/controllers/employees/updateEmployee.js";
import { verifyRole } from "@/http/middleware/verifyRole.js";
import z from "zod";



export async function employeeRoutes(app: FastifyTypedInstance) {
  app.get(
    "/:id",
    {
      preHandler: [verifyRole(["company", "admin", "employee"])],
      schema: {
        tags: ["employee"],
        description: "List unique employee by id",
        params: z.object({
          id: z.coerce.number(),
        }),
        response: {
          200: z.object({
            name: z.string(),
            enrollment: z.string(),
            role_name: z.string(),
            email: z.email(),
            phone_number: z.string(),

            addres: z.object({
                country: z.string().nullable().optional(),
                street: z.string().nullable().optional(),
                number: z.number().nullable().optional(),
                city: z.string().nullable().optional(),
                state: z.string().nullable().optional(),
                complement: z.string().nullable().optional(),
                zipcode: z.string().nullable().optional(),
              }),
          }),
        },
      },
    },
    getEmployee
  );

  
  app.get(
    "",
    {
      preHandler: [verifyRole(["company"])],
      schema: {
        tags: ["employee"],
        description: "List employees by company",
        response: {
          200: z.array(
            z.object({
              id: z.number(),
              name: z.string(),
              enrollment: z.string(),
              email: z.string().email(),
              phone_number: z.string(),
              role: z.object({ 
                id: z.number(),
                name: z.string(),
              }),
              addres: z.object({
                country: z.string().nullable().optional(),
                street: z.string().nullable().optional(),
                number: z.number().nullable().optional(),
                city: z.string().nullable().optional(),
                state: z.string().nullable().optional(),
                complement: z.string().nullable().optional(),
                zipcode: z.string().nullable().optional(),
              }),
            })
          ),
        },
      },
    },
    getAllEmployeesByCompany
  );

  app.post(
    "/auth",
    {
      schema: {
        tags: ["employee"],
        description: "login employee",
        body: employeeAuthBodySchema,
        response: {
          200: z.object({ token: z.string() }),
        },
      },
    },
    authEmployee
  );
  app.delete(
    "/:id",
    {
      preHandler: [verifyRole(["company"])],
      schema: {
        tags: ["employee"],
        description: "Delete employee by id",
        params: z.object({
          id: z.coerce.number(),
        }),
        response: {
          200: z.string(),
        },
      },
    },
    deleteEmployee
  );

  app.post(
    "",
    {
      preHandler: [verifyRole(["company"])],
      schema: {
        tags: ["employee"],
        description: "Create new employee",
        body: employeeRegisterBodySchema,
        response: {
          201: z.null().describe("Employee created"),
        },
      },
    },
    registerEmployee
  );

  app.put(
    "/:id",
    {
      preHandler: [verifyRole(["company"])],
      schema: {
        tags: ["employee"],
        description: "Update employee info",
        body: employeeUpdateBodySchema,
        response: {
          204: z.null().describe("Employee updated"),
        },
      },
    },
    updateEmployee
  );

}