import { FastifyReply, FastifyRequest } from "fastify";

import { listManagerSchema } from "../schemas";
import { ListManagerUseCase } from "../useCases/ListManagerUseCase";

export class ListManagerController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const validatedQuery = listManagerSchema.parse(request.query);

    const managers = await ListManagerUseCase.execute(validatedQuery);

    return reply.send(managers);
  }
}
