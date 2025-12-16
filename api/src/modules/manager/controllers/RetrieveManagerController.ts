import { FastifyReply, FastifyRequest } from "fastify";

import { retrieveManagerSchema } from "../schemas";
import { RetrieveManagerUseCase } from "../useCases/RetrieveManagerUseCase";

export class RetrieveManagerController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const validatedQuery = retrieveManagerSchema.parse(request.query);

    const manager = await RetrieveManagerUseCase.execute(validatedQuery);

    return reply.send(manager);
  }
}
