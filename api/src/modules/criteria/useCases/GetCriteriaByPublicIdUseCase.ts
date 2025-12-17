import databaseProjLeandroPromise from "../../../db/projLeandro";
import { AppError } from "../../../errors/appError";

interface IInput {
  publicId: string;
}

type IOutput = { id: number };

export class GetCriteriaByPublicIdUseCase {
  static async execute({ publicId }: IInput): Promise<IOutput> {
    const database = await databaseProjLeandroPromise;

    const criteria = await database.findFirst<{ id: number }>({
      table: "criteria",
      where: { public_id: publicId },
      select: { id: true },
    });

    if (!criteria) {
      throw new AppError("criteria not found", 404);
    }

    return criteria;
  }
}
