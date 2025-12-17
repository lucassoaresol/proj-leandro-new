import { FastifyReply, FastifyRequest } from "fastify";

import { retrieveProjectManagerSchema } from "../schemas";
import { RetrieveProjectManagerUseCase } from "../useCases/RetrieveProjectManagerUseCase";

export class RetrieveProjectManagerController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const parsed = retrieveProjectManagerSchema.parse(request.query);

    const result = await RetrieveProjectManagerUseCase.execute(parsed);

    return reply.send(result);
  }
}
