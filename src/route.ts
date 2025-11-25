import z from "zod";
import type { FastifyTypedInstance } from "./@types/types.js";
import {companyRegisterBodySchema,register,} from "./http/controllers/company/register.js";
import { getCompany } from "./http/controllers/company/getCompany.js";
import { getAllCompanies } from "./http/controllers/company/getAllCompany.js";
import { deleteCompany } from "./http/controllers/company/deleteCompany.js";
import {companyUpdateBodySchema,updateCompany,} from "./http/controllers/company/updateCompany.js";
import {registerProduct,productRegisterBodySchema,} from "./http/controllers/products/registerProduct.js";
import { getAllProducts } from "./http/controllers/products/getAllProduct.js";
import { getProduct } from "./http/controllers/products/getProduct.js";
import { deleteProduct } from "./http/controllers/products/deleteProduct.js";
import {registerStatus,statusRegisterBodySchema,} from "./http/controllers/status/registerStatus.js";
import { getAllStatus } from "./http/controllers/status/getAllStatus.js";
import { getStatus } from "./http/controllers/status/getStatus.js";
import { deleteStatus } from "./http/controllers/status/deleteStatus.js";
import {authCompany,companyAuthBodySchema,} from "./http/controllers/company/authCompany.js";
import { verifyRole } from "./http/middleware/verifyRole.js";
import { getEmployee } from "./http/controllers/employees/getEmployee.js";
import {authEmployee,employeeAuthBodySchema,} from "./http/controllers/employees/authEmployee.js";
import { deleteEmployee } from "./http/controllers/employees/deleteEmployee.js";
import { getAllEmployees } from "./http/controllers/employees/getAllEmployees.js";
import {employeeRegisterBodySchema,registerEmployee,} from "./http/controllers/employees/registerEmployee.js";
import {employeeUpdateBodySchema,updateEmployee,} from "./http/controllers/employees/updateEmployee.js";
import {statusUpdateBodySchema,updateStatus,} from "./http/controllers/status/updateStatus.js";
import {authClient,clientAuthBodySchema,} from "./http/controllers/client/authClient.js";
import {registerClient,clientRegisterBodySchema,} from "./http/controllers/client/register.Client.js";
import {updateClient,clientUpdateBodySchema,} from "./http/controllers/client/updateClient.js";
import { getClient } from "./http/controllers/client/getClient.js";
import { getAllClients } from "./http/controllers/client/getAllClient.js";
import { deleteClient } from "./http/controllers/client/deleteClient.js";
import {orderRegisterBodySchema, registerOrder,} from "./http/controllers/order/registerOrder.js";
import { getOrder } from "./http/controllers/order/getOrder.js";
import { getAllOrders } from "./http/controllers/order/getAllOrders.js";
import { deleteOrder } from "./http/controllers/order/deleteOrder.js";
import {orderUpdateBodySchema,updateOrder,} from "./http/controllers/order/updateOrder.js";
import { getAllAddres } from "./http/controllers/addres/getAllAddres.js";
import {addresRegisterBodySchema, registerAddres,} from "./http/controllers/addres/registerAddres.js";
import {addresUpdateBodySchema,updateAddres,} from "./http/controllers/addres/updateAddres.js";
import { deleteAddres } from "./http/controllers/addres/deleteAddres.js";
import { getInvoice } from "./http/controllers/invoice/getInvoice.js";
import { getAllInvoices } from "./http/controllers/invoice/getAllInvoices.js";
import {registerInvoice,invoiceRegisterBodySchema,} from "./http/controllers/invoice/registerInvoice.js";
import {updateInvoice,invoiceUpdateBodySchema,} from "./http/controllers/invoice/updateInvoice.js";
import { deleteInvoice } from "./http/controllers/invoice/deleteInvoice.js";
import { getVehicle } from "./http/controllers/vehicle/getVehicle.js";
import { getAllVehicles } from "./http/controllers/vehicle/getAllVehicles.js";
import { registerVehicle } from "./http/controllers/vehicle/registerVehicle.js";
import { updateVehicle } from "./http/controllers/vehicle/updateVehicle.js";
import { deleteVehicle } from "./http/controllers/vehicle/deleteVehicle.js";

export async function routes(app: FastifyTypedInstance) {
  app.get(
    "/company",
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
        tags: ["companies"],
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
    "/company/:id",
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
    "/auth/company",
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

  app.put(
    "/status/:id",
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

  app.get(
    "/employee/:id",
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
            id: z.number().int(),
            name: z.string(),
            enrollment: z.string(),
            employee_roles: z.number().int(),
            company_id: z.number().int(),
            email: z.email(),
            phone_number: z.string(),
          }),
        },
      },
    },
    getEmployee
  );

  app.get(
    "/employee",
    {
      preHandler: [verifyRole(["company", "admin"])],
      schema: {
        tags: ["employee"],
        description: "List employees",
        response: {
          200: z.array(
            z.object({
              id: z.number().int(),
              name: z.string(),
              enrollment: z.string(),
              employee_roles: z.number().int(),
              company_id: z.number().int(),
              email: z.email(),
              phone_number: z.string(),
            })
          ),
        },
      },
    },
    getAllEmployees
  );

  app.post(
    "/auth/employee",
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
    "/employee/:id",
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
    "/employee",
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
    "/employee/:id",
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

  app.post(
    "/auth/client",
    {
      schema: {
        tags: ["client"],
        description: "Auth client",
        body: clientAuthBodySchema,
        response: {
          200: z.object({ token: z.string() }),
        },
      },
    },
    authClient
  );

  app.post(
    "/client",
    {
      schema: {
        tags: ["client"],
        description: "Create new client",
        body: clientRegisterBodySchema,
        response: {
          201: z.null().describe("Client created"),
        },
      },
    },
    registerClient
  );

  app.get(
    "/client/:id",
    {
      preHandler: [verifyRole(["admin", "client"])],
      schema: {
        tags: ["client"],
        description: "List unique client by id",
        params: z.object({
          id: z.coerce.number(),
        }),
        response: {
          200: z.object({
            id: z.number().int(),
            name: z.string(),
            email: z.email(),
            phone_number: z.string(),
            CPF: z.string(),
            CNPJ: z.string(),
            client_roles: z.number().int(),
            addres_id: z.number().int(),
          }),
        },
      },
    },
    getClient
  );

  app.get(
    "/client",
    {
      preHandler: [verifyRole(["admin", "company"])],
      schema: {
        tags: ["client"],
        description: "List all clients",
        response: {
          200: z.array(
            z.object({
              id: z.number().int(),
              name: z.string(),
              email: z.email(),
              phone_number: z.string(),
              CPF: z.string(),
              CNPJ: z.string(),
              client_roles: z.number().int(),
              addres_id: z.number().int(),
            })
          ),
        },
      },
    },
    getAllClients
  );

  app.put(
    "/client/:id",
    {
      preHandler: [verifyRole(["admin", "client"])],
      schema: {
        tags: ["client"],
        description: "Update client info",
        params: z.object({
          id: z.coerce.number(),
        }),
        body: clientUpdateBodySchema,
        response: {
          204: z.null().describe("Client updated"),
        },
      },
    },
    updateClient
  );

  app.delete(
    "/client/:id",
    {
      preHandler: [verifyRole(["admin"])],
      schema: {
        tags: ["client"],
        description: "Delete client by id",
        params: z.object({
          id: z.coerce.number(),
        }),
        response: {
          200: z.string(),
        },
      },
    },
    deleteClient
  );

  app.get(
    "/order/:id",
    {
      schema: {
        tags: ["order"],
        description: "Get order by id",
        params: z.object({
          id: z.coerce.number(),
        }),
        response: {
          200: z.object({
            id: z.number().int(),
            code: z.string(),
            sender_client_id: z.number().int(),
            recipient_id: z.number().int(),
            status_id: z.number().int(),
            vehicle_id: z.number().int(),
          }),
        },
      },
    },
    getOrder
  );

  app.get(
    "/order",
    {
      schema: {
        tags: ["order"],
        description: "List all orders",
        response: {
          200: z.array(
            z.object({
              id: z.number().int(),
              code: z.string(),
              sender_client_id: z.number().int(),
              recipient_id: z.number().int(),
              status_id: z.number().int(),
              vehicle_id: z.number().int(),
            })
          ),
        },
      },
    },
    getAllOrders
  );

  app.post(
    "/order",
    {
      schema: {
        tags: ["order"],
        description: "Create new order",
        body: orderRegisterBodySchema,
        response: {
          201: z.null().describe("Order created"),
        },
      },
    },
    registerOrder
  );

  app.put(
    "/order/:id",
    {
      schema: {
        tags: ["order"],
        description: "Update order info",
        params: z.object({
          id: z.coerce.number(),
        }),
        body: orderUpdateBodySchema,
        response: {
          204: z.null().describe("Order updated"),
        },
      },
    },
    updateOrder
  );

  app.delete(
    "/order/:id",
    {
      schema: {
        tags: ["order"],
        description: "Delete order by id",
        params: z.object({
          id: z.coerce.number(),
        }),
        response: {
          200: z.string().describe("Order deleted"),
        },
      },
    },
    deleteOrder
  );

  app.get(
    "/addres/:id",
    {
      schema: {
        tags: ["addres"],
        description: "Get addres by id",
        params: z.object({
          id: z.coerce.number(),
        }),
        response: {
          200: z.object({
            id: z.number().int(),
            country: z.string(),
            state: z.string(),
            city: z.string(),
            street: z.string(),
            number: z.number().int(),
            zipcode: z.string(),
            complement: z.string(),
          }),
        },
      },
    },
    getOrder
  );

  app.get(
    "/addres",
    {
      schema: {
        tags: ["addres"],
        description: "List all addres",
        response: {
          200: z.array(
            z.object({
              id: z.number().int(),
              country: z.string(),
              state: z.string(),
              city: z.string(),
              street: z.string(),
              number: z.number().int(),
              zipcode: z.string(),
              complement: z.string(),
            })
          ),
        },
      },
    },
    getAllAddres
  );

  app.post(
    "/addres",
    {
      schema: {
        tags: ["addres"],
        description: "Create new addres",
        body: addresRegisterBodySchema,
        response: {
          201: z.null().describe("Addres created"),
        },
      },
    },
    registerAddres
  );

  app.put(
    "/addres/:id",
    {
      schema: {
        tags: ["addres"],
        description: "Update addres info",
        params: z.object({
          id: z.coerce.number(),
        }),
        body: addresUpdateBodySchema,
        response: {
          204: z.null().describe("Addres updated"),
        },
      },
    },
    updateAddres
  );

  app.delete(
    "/addres/:id",
    {
      schema: {
        tags: ["addres"],
        description: "Delete addres by id",
        params: z.object({
          id: z.coerce.number(),
        }),
        response: {
          200: z.string().describe("Addres deleted"),
        },
      },
    },
    deleteAddres
  );

  app.get(
    "/invoice/:id",
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
            client_id: z.number().int(),
            invoice_number: z.number().int(),
            issue_date: z.string(),
            due_date: z.string(),
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
    "/invoice",
    {
      schema: {
        tags: ["invoice"],
        description: "List all invoices",
        response: {
          200: z.array(
            z.object({
              id: z.number().int(),
              client_id: z.number().int(),
              invoice_number: z.number().int(),
              issue_date: z.string(),
              due_date: z.string(),
              total_amount: z.number(),
              tax_amount: z.number(),
              status_id: z.number(),
              link_file: z.string(),
            })
          ),
        },
      },
    },
    getAllInvoices
  );

  app.post(
    "/invoice",
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
    "/invoice/:id",
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
    "/invoice/:id",
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

  app.get(
  "/vehicle/:id",
  {
    schema: {
      tags: ["vehicle"],
      description: "Get vehicle by id",
      params: z.object({
        id: z.coerce.number(),
      }),
      response: {
        200: z.object({
          id: z.number().int(),
          plate: z.string(),
          model: z.string(),
          capacity: z.number().int(),
          status_id: z.number().int(),
          company_id: z.number().int(),
        }),
      },
    },
  },
  getVehicle
);

app.get(
  "/vehicle",
  {
    schema: {
      tags: ["vehicle"],
      description: "List all vehicles",
      response: {
        200: z.array(
          z.object({
            id: z.number().int(),
            plate: z.string(),
            model: z.string(),
            capacity: z.number().int(),
            status_id: z.number().int(),
            company_id: z.number().int(),
          })
        ),
      },
    },
  },
  getAllVehicles
);

app.post(
  "/vehicle",
  {
    schema: {
      tags: ["vehicle"],
      description: "Create new vehicle",
      body: z.object({
        plate: z.string(),
        model: z.string(),
        capacity: z.number().int(),
        status_id: z.number().int(),
        company_id: z.number().int(),
      }),
      response: {
        201: z.null().describe("Vehicle created"),
      },
    },
  },
  registerVehicle
);

app.put(
  "/vehicle/:id",
  {
    schema: {
      tags: ["vehicle"],
      description: "Update vehicle info",
      params: z.object({
        id: z.coerce.number(),
      }),
      body: z.object({
        plate: z.string(),
        model: z.string(),
        capacity: z.number().int(),
        status_id: z.number().int(),
        company_id: z.number().int(),
      }),
      response: {
        204: z.null().describe("Vehicle updated"),
      },
    },
  },
  updateVehicle
);

app.delete(
  "/vehicle/:id",
  {
    schema: {
      tags: ["vehicle"],
      description: "Delete vehicle by id",
      params: z.object({
        id: z.coerce.number(),
      }),
      response: {
        200: z.string().describe("Vehicle deleted"),
      },
    },
  },
  deleteVehicle
);
}
