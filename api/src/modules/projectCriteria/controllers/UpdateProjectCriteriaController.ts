import { FastifyReply, FastifyRequest } from "fastify";

import { paramsIdSchema } from "../../schemas";
import { updateProjectCriteriaSchema } from "../schemas";
import { UpdateProjectCriteriaUseCase } from "../useCases/UpdateProjectCriteriaUseCase";

export class UpdateProjectCriteriaController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const params = paramsIdSchema.parse(request.params);
    const parsed = updateProjectCriteriaSchema.parse(request.body);

    await UpdateProjectCriteriaUseCase.execute({ ...params, ...parsed });

    return reply.code(204).send();
  }
}
