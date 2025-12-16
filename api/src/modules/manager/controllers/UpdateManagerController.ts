import { FastifyReply, FastifyRequest } from "fastify";

import { paramsIdSchema } from "../../schemas";
import { updateManagerSchema } from "../schemas";
import { UpdateManagerUseCase } from "../useCases/UpdateManagerUseCase";

export class UpdateManagerController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const params = paramsIdSchema.parse(request.params);
    const parsed = updateManagerSchema.parse(request.body);

    await UpdateManagerUseCase.execute({
      ...params,
      ...parsed,
    });

    return reply.code(204).send();
  }
}
