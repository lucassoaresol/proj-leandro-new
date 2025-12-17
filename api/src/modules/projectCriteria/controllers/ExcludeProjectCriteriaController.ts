import { FastifyReply, FastifyRequest } from "fastify";

import { paramsIdSchema } from "../../schemas";
import { ExcludeProjectCriteriaUseCase } from "../useCases/ExcludeProjectCriteriaUseCase";

export class ExcludeProjectCriteriaController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const params = paramsIdSchema.parse(request.params);

    await ExcludeProjectCriteriaUseCase.execute(params);

    return reply.code(204).send();
  }
}
