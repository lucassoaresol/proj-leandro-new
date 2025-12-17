import { FastifyReply, FastifyRequest } from "fastify";

import { createProjectCriteriaSchema } from "../schemas";
import { CreateProjectCriteriaUseCase } from "../useCases/CreateProjectCriteriaUseCase";

export class CreateProjectCriteriaController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const parsed = createProjectCriteriaSchema.parse(request.body);

    await CreateProjectCriteriaUseCase.execute(parsed);

    return reply.code(204).send();
  }
}
