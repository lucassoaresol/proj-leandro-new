import { FastifyReply, FastifyRequest } from "fastify";

import { listProjectObjectSchema } from "../schemas";
import { ListProjectObjectUseCase } from "../useCases/ListProjectObjectUseCase";

export class ListProjectObjectController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const parsed = listProjectObjectSchema.parse(request.query);

    const result = await ListProjectObjectUseCase.execute(parsed);

    return reply.send(result);
  }
}
