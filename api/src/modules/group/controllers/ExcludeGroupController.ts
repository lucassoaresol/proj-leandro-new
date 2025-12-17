import { FastifyReply, FastifyRequest } from "fastify";

import { paramsIdSchema } from "../../schemas";
import { ExcludeGroupUseCase } from "../useCases/ExcludeGroupUseCase";

export class ExcludeGroupController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const params = paramsIdSchema.parse(request.params);

    await ExcludeGroupUseCase.execute(params);

    return reply.code(204).send();
  }
}
