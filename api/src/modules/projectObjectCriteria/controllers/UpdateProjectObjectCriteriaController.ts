import { FastifyReply, FastifyRequest } from "fastify";

import { paramsIdSchema } from "../../schemas";
import { updateProjectObjectCriteriaSchema } from "../schemas";
import { UpdateProjectObjectCriteriaUseCase } from "../useCases/UpdateProjectObjectCriteriaUseCase";

export class UpdateProjectObjectCriteriaController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const params = paramsIdSchema.parse(request.params);
    const parsed = updateProjectObjectCriteriaSchema.parse(request.body);

    await UpdateProjectObjectCriteriaUseCase.execute({
      ...params,
      ...parsed,
    });

    return reply.code(204).send();
  }
}
