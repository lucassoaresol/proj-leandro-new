import { FastifyReply, FastifyRequest } from "fastify";

import { createProjectObjectCriteriaSchema } from "../schemas";
import { CreateProjectObjectCriteriaUseCase } from "../useCases/CreateProjectObjectCriteriaUseCase";

export class CreateProjectObjectCriteriaController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const parsed = createProjectObjectCriteriaSchema.parse(request.body);

    await CreateProjectObjectCriteriaUseCase.execute(parsed);

    return reply.code(204).send();
  }
}
