import cors from "cors";
import type { Express } from "express";
import express from "express";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { errorHandler } from "./api/middlewares/error-handler.ts";
import { registerRouters } from "./api/routers/index.ts";
import { swaggerSpec } from "./swagger.ts";
import { getDirname } from "./utils/get-dirname.ts";

const app: Express = express();
const { __dirname } = getDirname(import.meta.url);

app.use(express.json());
app.use(cors());

app.use(
  "/products/images",
  express.static(
    path.resolve(__dirname, "..", "public", "products", "images")
  )
);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /ping:
 *   get:
 *     summary: Verifica se o servidor está funcionando
 *     description: Retorna uma mensagem simples para testar disponibilidade.
 *     tags:
 *       - Healthcheck
 *     responses:
 *       200:
 *         description: Servidor respondendo corretamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: pong
 */
app.get("/ping", (_, res) => {
  res.json({ message: "pong" });
});

registerRouters(app);

app.use(errorHandler);

export { app };

