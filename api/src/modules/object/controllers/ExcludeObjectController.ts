import { FastifyReply, FastifyRequest } from "fastify";

import { paramsIdSchema } from "../../schemas";
import { ExcludeObjectUseCase } from "../useCases/ExcludeObjectUseCase";

export class ExcludeObjectController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const params = paramsIdSchema.parse(request.params);

    await ExcludeObjectUseCase.execute(params);

    return reply.code(204).send();
  }
}
