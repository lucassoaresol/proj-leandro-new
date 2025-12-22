import { FastifyReply, FastifyRequest } from "fastify";

import { paramsIdSchema } from "../../schemas";
import { ExcludeProjectObjectCriteriaUseCase } from "../useCases/ExcludeProjectObjectCriteriaUseCase";

export class ExcludeProjectObjectCriteriaController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const params = paramsIdSchema.parse(request.params);

    await ExcludeProjectObjectCriteriaUseCase.execute(params);

    return reply.code(204).send();
  }
}
