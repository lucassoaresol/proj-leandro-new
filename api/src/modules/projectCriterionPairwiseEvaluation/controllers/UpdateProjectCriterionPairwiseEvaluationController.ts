import { FastifyReply, FastifyRequest } from "fastify";

import { paramsIdSchema } from "../../schemas";
import { updateProjectCriterionPairwiseEvaluationSchema } from "../schemas";
import { UpdateProjectCriterionPairwiseEvaluationUseCase } from "../useCases/UpdateProjectCriterionPairwiseEvaluationUseCase";

export class UpdateProjectCriterionPairwiseEvaluationController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const params = paramsIdSchema.parse(request.params);
    const parsed = updateProjectCriterionPairwiseEvaluationSchema.parse(
      request.body,
    );

    await UpdateProjectCriterionPairwiseEvaluationUseCase.execute({
      ...params,
      ...parsed,
    });

    return reply.code(204).send();
  }
}
