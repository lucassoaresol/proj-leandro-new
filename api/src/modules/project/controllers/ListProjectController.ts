import { FastifyReply, FastifyRequest } from "fastify";

import { listProjectSchema } from "../schemas";
import { ListProjectUseCase } from "../useCases/ListProjectUseCase";

export class ListProjectController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const parsed = listProjectSchema.parse(request.query);

    const data = await ListProjectUseCase.execute(parsed);

    return reply.send(data);
  }
}
