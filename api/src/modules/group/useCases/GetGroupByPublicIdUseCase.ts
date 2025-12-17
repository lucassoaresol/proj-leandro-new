import databaseProjLeandroPromise from "../../../db/projLeandro";
import { AppError } from "../../../errors/appError";

interface IInput {
  publicId: string;
}

type IOutput = { id: number };

export class GetGroupByPublicIdUseCase {
  static async execute({ publicId }: IInput): Promise<IOutput> {
    const database = await databaseProjLeandroPromise;

    const group = await database.findFirst<{ id: number }>({
      table: "groups",
      where: { public_id: publicId },
      select: { id: true },
    });

    if (!group) {
      throw new AppError("group not found", 404);
    }

    return group;
  }
}
