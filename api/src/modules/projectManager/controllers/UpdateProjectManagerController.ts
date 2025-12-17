import { FastifyReply, FastifyRequest } from "fastify";

import { paramsIdSchema } from "../../schemas";
import { updateProjectManagerSchema } from "../schemas";
import { UpdateProjectManagerUseCase } from "../useCases/UpdateProjectManagerUseCase";

export class UpdateProjectManagerController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const params = paramsIdSchema.parse(request.params);
    const parsed = updateProjectManagerSchema.parse(request.body);

    await UpdateProjectManagerUseCase.execute({ ...params, ...parsed });

    return reply.code(204).send();
  }
}
