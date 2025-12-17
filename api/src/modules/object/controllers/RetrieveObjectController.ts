import { FastifyReply, FastifyRequest } from "fastify";

import { retrieveObjectSchema } from "../schemas";
import { RetrieveObjectUseCase } from "../useCases/RetrieveObjectUseCase";

export class RetrieveObjectController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const validatedQuery = retrieveObjectSchema.parse(request.query);

    const object = await RetrieveObjectUseCase.execute(validatedQuery);

    return reply.send(object);
  }
}
