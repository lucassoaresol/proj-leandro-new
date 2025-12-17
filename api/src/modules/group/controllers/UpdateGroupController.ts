import { FastifyReply, FastifyRequest } from "fastify";

import { paramsIdSchema } from "../../schemas";
import { updateGroupSchema } from "../schemas";
import { UpdateGroupUseCase } from "../useCases/UpdateGroupUseCase";

export class UpdateGroupController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const params = paramsIdSchema.parse(request.params);
    const parsed = updateGroupSchema.parse(request.body);

    await UpdateGroupUseCase.execute({
      ...params,
      ...parsed,
    });

    return reply.code(204).send();
  }
}
