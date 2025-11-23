import swaggerJsdoc from "swagger-jsdoc";
import { env } from "./env.ts";

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Burguer Joint Menu API",
      version: "1.0.0",
      description: "API documentation for the Burguer Joint Menu application",
    },
    servers: [
      {
        url: "http://localhost:" + env.PORT,
        description: "Local development server",
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      }
    }
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts", "./src/app.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export { swaggerSpec };