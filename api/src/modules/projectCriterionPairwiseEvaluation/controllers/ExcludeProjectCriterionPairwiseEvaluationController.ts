import { FastifyReply, FastifyRequest } from "fastify";

import { paramsIdSchema } from "../../schemas";
import { ExcludeProjectCriterionPairwiseEvaluationUseCase } from "../useCases/ExcludeProjectCriterionPairwiseEvaluationUseCase";

export class ExcludeProjectCriterionPairwiseEvaluationController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const params = paramsIdSchema.parse(request.params);

    await ExcludeProjectCriterionPairwiseEvaluationUseCase.execute(params);

    return reply.code(204).send();
  }
}
