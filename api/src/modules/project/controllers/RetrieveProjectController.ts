import { FastifyReply, FastifyRequest } from "fastify";

import { retrieveProjectSchema } from "../schemas";
import { RetrieveProjectUseCase } from "../useCases/RetrieveProjectUseCase";

export class RetrieveProjectController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const parsed = retrieveProjectSchema.parse(request.query);

    const data = await RetrieveProjectUseCase.execute(parsed);

    return reply.send(data);
  }
}
