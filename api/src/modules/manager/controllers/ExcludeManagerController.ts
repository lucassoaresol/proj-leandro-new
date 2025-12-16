import { FastifyReply, FastifyRequest } from "fastify";

import { paramsIdSchema } from "../../schemas";
import { ExcludeManagerUseCase } from "../useCases/ExcludeManagerUseCase";

export class ExcludeManagerController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const params = paramsIdSchema.parse(request.params);

    await ExcludeManagerUseCase.execute({ ...params });

    return reply.code(204).send();
  }
}
