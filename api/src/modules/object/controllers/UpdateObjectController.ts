import { FastifyReply, FastifyRequest } from "fastify";

import { paramsIdSchema } from "../../schemas";
import { updateObjectSchema } from "../schemas";
import { UpdateObjectUseCase } from "../useCases/UpdateObjectUseCase";

export class UpdateObjectController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const params = paramsIdSchema.parse(request.params);
    const parsed = updateObjectSchema.parse(request.body);

    await UpdateObjectUseCase.execute({
      ...params,
      ...parsed,
    });

    return reply.code(204).send();
  }
}
