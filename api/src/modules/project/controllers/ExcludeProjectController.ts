import { FastifyReply, FastifyRequest } from "fastify";

import { paramsIdSchema } from "../../schemas";
import { ExcludeProjectUseCase } from "../useCases/ExcludeProjectUseCase";

export class ExcludeProjectController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const params = paramsIdSchema.parse(request.params);

    await ExcludeProjectUseCase.execute(params);

    return reply.code(204).send();
  }
}
