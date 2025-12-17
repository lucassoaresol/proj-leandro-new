import { FastifyReply, FastifyRequest } from "fastify";

import { createProjectManagerSchema } from "../schemas";
import { CreateProjectManagerUseCase } from "../useCases/CreateProjectManagerUseCase";

export class CreateProjectManagerController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const parsed = createProjectManagerSchema.parse(request.body);

    await CreateProjectManagerUseCase.execute(parsed);

    return reply.code(204).send();
  }
}
