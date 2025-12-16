import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";

import { AppError } from "./appError";

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      message: error.message,
    });
  }

  if (error instanceof ZodError) {
    const allMessages = error.issues.map((err) => ({
      path: err.path.join(".") || "form",
      message: err.message,
    }));
    return reply.status(400).send({ message: allMessages });
  }

  console.log(error);

  return reply.status(500).send({
    message: "Internal server error",
  });
}
