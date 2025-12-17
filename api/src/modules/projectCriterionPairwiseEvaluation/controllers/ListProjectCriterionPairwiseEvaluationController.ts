import { FastifyReply, FastifyRequest } from "fastify";

import { listProjectCriterionPairwiseEvaluationSchema } from "../schemas";
import { ListProjectCriterionPairwiseEvaluationUseCase } from "../useCases/ListProjectCriterionPairwiseEvaluationUseCase";

export class ListProjectCriterionPairwiseEvaluationController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const parsed = listProjectCriterionPairwiseEvaluationSchema.parse(
      request.query,
    );

    const result =
      await ListProjectCriterionPairwiseEvaluationUseCase.execute(parsed);

    return reply.send(result);
  }
}
