import { FastifyReply, FastifyRequest } from "fastify";

import { createProjectCriterionPairwiseEvaluationSchema } from "../schemas";
import { CreateProjectCriterionPairwiseEvaluationUseCase } from "../useCases/CreateProjectCriterionPairwiseEvaluationUseCase";

export class CreateProjectCriterionPairwiseEvaluationController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const parsed = createProjectCriterionPairwiseEvaluationSchema.parse(
      request.body,
    );

    await CreateProjectCriterionPairwiseEvaluationUseCase.execute(parsed);

    return reply.code(204).send();
  }
}
