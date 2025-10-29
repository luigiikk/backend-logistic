import { app } from "@/app.js";
import { fastifyCors } from "@fastify/cors"
import {validatorCompiler, serializerCompiler, jsonSchemaTransform} from 'fastify-type-provider-zod'
import { env } from "@/env/index.js";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { routes } from "./route.js";
import fastifyJwt from "@fastify/jwt";

// input data
app.setValidatorCompiler(validatorCompiler);
// output data
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {origin: '*'});

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Logistic API',
      version: '1.0.0',
    }
  },
  transform: jsonSchemaTransform
});

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
});

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});
app.register(routes);

app.listen({
  host: '0.0.0.0',
  port: env.PORT,
}).then(() =>{
  console.log("HTTP SERVER RUNNING");
});


