import { env } from "./env.ts";
import { app } from "./app.ts";

app.listen(env.PORT, () => {
  console.log("> 🌐HTTP Server is running...");
});