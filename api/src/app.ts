import FastifyCors from "@fastify/cors";
import Fastify from "fastify";

import { errorHandler } from "./errors/handleError";

const app = Fastify();

app.register(FastifyCors, {
  origin: true,
  methods: ["GET", "PATCH", "POST", "PUT", "DELETE", "OPTIONS"],
});

app.setErrorHandler(errorHandler);

export default app;
