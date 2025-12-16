import FastifyCors from "@fastify/cors";
import Fastify from "fastify";

import { errorHandler } from "./errors/handleError";
import router from "./routes";
import "./cron";

const app = Fastify();

app.register(FastifyCors, {
  origin: true,
  methods: ["GET", "PATCH", "POST", "PUT", "DELETE", "OPTIONS"],
});
app.register(router, { prefix: "/api" });

app.setErrorHandler(errorHandler);

export default app;
