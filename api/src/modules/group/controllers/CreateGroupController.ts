import { FastifyReply, FastifyRequest } from "fastify";

import { createGroupSchema } from "../schemas";
import { CreateGroupUseCase } from "../useCases/CreateGroupUseCase";

export class CreateGroupController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const parsed = createGroupSchema.parse(request.body);

    await CreateGroupUseCase.execute(parsed);

    return reply.code(204).send();
  }
}
