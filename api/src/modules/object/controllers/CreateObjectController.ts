import { FastifyReply, FastifyRequest } from "fastify";

import { createObjectSchema } from "../schemas";
import { CreateObjectUseCase } from "../useCases/CreateObjectUseCase";

export class CreateObjectController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const parsed = createObjectSchema.parse(request.body);

    await CreateObjectUseCase.execute(parsed);

    return reply.code(204).send();
  }
}
