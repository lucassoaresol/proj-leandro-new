import { FastifyReply, FastifyRequest } from "fastify";

import { retrieveProjectCriterionPairwiseEvaluationSchema } from "../schemas";
import { RetrieveProjectCriterionPairwiseEvaluationUseCase } from "../useCases/RetrieveProjectCriterionPairwiseEvaluationUseCase";

export class RetrieveProjectCriterionPairwiseEvaluationController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const parsed = retrieveProjectCriterionPairwiseEvaluationSchema.parse(
      request.query,
    );

    const result =
      await RetrieveProjectCriterionPairwiseEvaluationUseCase.execute(parsed);

    return reply.send(result);
  }
}
