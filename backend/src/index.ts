import "dotenv/config"; 
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";

import authRouter from "./routes/auth.routes";
import noteRoutes from "./routes/note.routes";
import aiRouter from "./routes/ai.routes";

const app = new Hono();

app.use("*", cors());

app.get("/", (c) => {
  return c.text("Backend running");
});

app.route("/api/auth", authRouter);
app.route("/api/notes", noteRoutes);
app.route("/api/ai", aiRouter);

const port = 5000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port: port,
});