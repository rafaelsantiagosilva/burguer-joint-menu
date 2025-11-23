import cors from "cors";
import type { Express } from "express";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { z } from "zod";
import { db } from "./database/index.ts";
import { users } from "./database/schema/users.ts";
import { swaggerSpec } from "./swagger.ts";
import { errorHandler } from "./middlewares/error-handler.ts";

const app: Express = express();

app.use(express.json());
app.use(cors());

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

const registerSchema = z.object({
  email: z.email(),
  password: z.string(),
})

app.post("/users/register", async (req, res) => {
  const { email, password } = registerSchema.parse(req.body);
  await db.insert(users).values({ name: null, email, password, address: null });
  console.log("> User registered:", email);
  res.status(201).json({ message: "User created successfully" });
});

app.use(errorHandler);

export { app };

