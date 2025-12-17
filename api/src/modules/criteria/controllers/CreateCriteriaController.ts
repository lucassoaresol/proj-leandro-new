import { FastifyReply, FastifyRequest } from "fastify";

import { createCriteriaSchema } from "../schemas";
import { CreateCriteriaUseCase } from "../useCases/CreateCriteriaUseCase";

export class CreateCriteriaController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const parsed = createCriteriaSchema.parse(request.body);

    await CreateCriteriaUseCase.execute(parsed);

    return reply.code(204).send();
  }
}
