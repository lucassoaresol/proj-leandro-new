import { FastifyReply, FastifyRequest } from "fastify";

import { paramsIdSchema } from "../../schemas";
import { updateCriteriaSchema } from "../schemas";
import { UpdateCriteriaUseCase } from "../useCases/UpdateCriteriaUseCase";

export class UpdateCriteriaController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const params = paramsIdSchema.parse(request.params);
    const parsed = updateCriteriaSchema.parse(request.body);

    await UpdateCriteriaUseCase.execute({
      ...params,
      ...parsed,
    });

    return reply.code(204).send();
  }
}
