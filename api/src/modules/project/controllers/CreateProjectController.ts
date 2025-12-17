import { FastifyReply, FastifyRequest } from "fastify";

import { createProjectSchema } from "../schemas";
import { CreateProjectUseCase } from "../useCases/CreateProjectUseCase";

export class CreateProjectController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const parsed = createProjectSchema.parse(request.body);

    await CreateProjectUseCase.execute(parsed);

    return reply.code(204).send();
  }
}
