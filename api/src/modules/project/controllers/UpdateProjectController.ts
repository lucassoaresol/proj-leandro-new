import { FastifyReply, FastifyRequest } from "fastify";

import { updateManagerSchema } from "../../manager/schemas";
import { paramsIdSchema } from "../../schemas";
import { UpdateProjectUseCase } from "../useCases/UpdateProjectUseCase";

export class UpdateProjectController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const params = paramsIdSchema.parse(request.params);
    const parsed = updateManagerSchema.parse(request.body);

    await UpdateProjectUseCase.execute({ ...params, ...parsed });

    return reply.code(204).send();
  }
}
