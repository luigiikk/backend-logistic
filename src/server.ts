import { app } from "@/app.js";
import { fastifyCors } from "@fastify/cors"
import {validatorCompiler, serializerCompiler, jsonSchemaTransform} from 'fastify-type-provider-zod'
import { env } from "@/env/index.js";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyJwt from "@fastify/jwt";
import { companyRoutes } from "./routes/company.routes.js";
import { productRoutes } from "./routes/product.route.js";
import { statusRoutes } from "./routes/stauts.route.js";
import { employeeRoutes } from "./routes/employee.routes.js";
import { clientRoutes } from "./routes/client.routes.js";
import { orderRoutes } from "./routes/order.routes.js";
import { categoryRoutes } from "./routes/category.routes.js";
import { resourceRoutes } from "./routes/resource.routes.js";
import { warehouseRoutes } from "./routes/warehouse.routes.js";
import { inventoryRoutes } from "./routes/inventory.routes.js";
import { invoiceRoutes } from "./routes/invoice.routes.js";
import { purchaseOrdersRoutes } from "./routes/purchase-orders.routes.js";
import { vehicleRoutes } from "./routes/vehicle.routes.js";
import { roulesRoutes } from "./routes/roule.routes.js";
import { supplierRoutes } from "./routes/supplier.route.js";
import { purchaseOrdersItemsRoutes } from "./routes/purchase-order-items.routes.js";
import { supportRoutes } from "./routes/suport.routes.js";
import { orderTrackingRoutes } from "./routes/order-tracking.route.js";
import { AppError } from "./services/erros/AppError.js";
import { vehicleMaintenanceRoutes } from "./routes/maintenance-vechile.routes.js";
import { vehicleDocumentRoutes } from "./routes/document-vehicle.routes.js";
import { reportsRoutes } from "./routes/reports.routes.js";

// input data
app.setValidatorCompiler(validatorCompiler);
// output data
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
});

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Logistic API',
      version: '1.0.0',
    },
    security: [{ jwt: [] }],
    components: {
      securitySchemes: {
        jwt: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
});

app.setErrorHandler((error, request, reply) => {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({ message: error.message });
  }

  console.error(error);
  return reply.status(500).send({ message: "Erro interno no servidor." });
});


app.register(companyRoutes, { prefix: "company" });
app.register(productRoutes, {prefix: "product"});
app.register(statusRoutes, {prefix: "status"});
app.register(employeeRoutes, {prefix: "employee"});
app.register(clientRoutes, {prefix: "client"});
app.register(orderRoutes, {prefix: "order"});
app.register(categoryRoutes, {prefix: "category-resource"});
app.register(resourceRoutes, {prefix: "resource"});
app.register(warehouseRoutes, {prefix: "warehouses"});
app.register(inventoryRoutes, {prefix: "inventory"});
app.register(invoiceRoutes, {prefix: "invoice"});
app.register(purchaseOrdersRoutes, {prefix: "purchase-orders"});
app.register(vehicleRoutes, {prefix: "vehicle"});
app.register(roulesRoutes, {prefix: "roules"});
app.register(supplierRoutes, {prefix: "supplier"});
app.register(purchaseOrdersItemsRoutes, {prefix: "purchase-order-items"});
app.register(supportRoutes, {prefix: "email"})
app.register(orderTrackingRoutes, {prefix: "tracking"})
app.register(vehicleDocumentRoutes, { prefix: "/vehicle/:vehicle_id/documents" });
app.register(vehicleMaintenanceRoutes, { prefix: "/vehicle/:vehicle_id/maintenance" });
app.register(reportsRoutes, { prefix: "reports" });

app.listen({
  host: '0.0.0.0',
  port: env.PORT,
}).then(() =>{
  console.log("HTTP SERVER RUNNING");
});


