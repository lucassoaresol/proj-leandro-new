import { FastifyReply, FastifyRequest } from "fastify";

import { paramsIdSchema } from "../../schemas";
import { ExcludeProjectObjectUseCase } from "../useCases/ExcludeProjectObjectUseCase";

export class ExcludeProjectObjectController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const params = paramsIdSchema.parse(request.params);

    await ExcludeProjectObjectUseCase.execute(params);

    return reply.code(204).send();
  }
}
