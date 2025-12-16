import { FastifyReply, FastifyRequest } from "fastify";

import { createManagerSchema } from "../schemas";
import { CreateManagerUseCase } from "../useCases/CreateManagerUseCase";

export class CreateManagerController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const parsed = createManagerSchema.parse(request.body);

    await CreateManagerUseCase.execute(parsed);

    return reply.code(204).send();
  }
}
