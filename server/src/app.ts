import bodyParser from "body-parser";
import cors from "cors";
import type { Express } from "express";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.ts";

const app: Express = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

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
  res.send({ message: "pong" });
});

export { app };

