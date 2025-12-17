import { FastifyReply, FastifyRequest } from "fastify";

import { listGroupSchema } from "../schemas";
import { ListGroupUseCase } from "../useCases/ListGroupUseCase";

export class ListGroupController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const validatedQuery = listGroupSchema.parse(request.query);

    const groups = await ListGroupUseCase.execute(validatedQuery);

    return reply.send(groups);
  }
}
