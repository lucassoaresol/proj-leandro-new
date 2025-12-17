import { FastifyReply, FastifyRequest } from "fastify";

import { paramsIdSchema } from "../../schemas";
import { ExcludeCriteriaUseCase } from "../useCases/ExcludeCriteriaUseCase";

export class ExcludeCriteriaController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const params = paramsIdSchema.parse(request.params);

    await ExcludeCriteriaUseCase.execute(params);

    return reply.code(204).send();
  }
}
