import { FastifyReply, FastifyRequest } from "fastify";

import { paramsIdSchema } from "../../schemas";
import { ExcludeProjectManagerUseCase } from "../useCases/ExcludeProjectManagerUseCase";

export class ExcludeProjectManagerController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const params = paramsIdSchema.parse(request.params);

    await ExcludeProjectManagerUseCase.execute(params);

    return reply.code(204).send();
  }
}
