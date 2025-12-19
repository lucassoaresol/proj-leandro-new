import { FastifyReply, FastifyRequest } from "fastify";

import { createProjectObjectSchema } from "../schemas";
import { CreateProjectObjectUseCase } from "../useCases/CreateProjectObjectUseCase";

export class CreateProjectObjectController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const parsed = createProjectObjectSchema.parse(request.body);

    await CreateProjectObjectUseCase.execute(parsed);

    return reply.code(204).send();
  }
}
