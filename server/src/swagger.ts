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
      },
      schemas: {
        GetUserProfileResponse: {
          type: "object",
          properties: {
            name: { type: "string", nullable: true },
            phone: { type: "string" },
            isAdmin: { type: "boolean" },
            address: { type: "string", nullable: true },
          },
        },
        InvalidProductPriceResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "One or more products in the order have an invalid price." },
          }
        },
        InvalidProductQuantityResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "One or more products in the order have an invalid quantity." },
          }
        },
        NotAvailableProductResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "One or more products in the order are not available." },
          }
        },
        WithoutProductsResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "An order must have at least one product." },
          }
        },
        UnauthorizedResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Unauthorized" },
          }
        },
        InvalidCredentialsResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Invalid email or password." },
          }
        },
        NotFoundResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Resource not found" },
          }
        },
        UserAlreadyExistsResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "User with this email already exists." },
          }
        },
        InternalServerErrorResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Internal server error" },
          }
        }
      }
    }
  },
  apis: [
    "./src/api/routers/*.ts",
    "./src/app.ts"
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export { swaggerSpec };