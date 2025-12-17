import databaseProjLeandroPromise from "../../../db/projLeandro";
import { AppError } from "../../../errors/appError";
import { ICriteriaCreate } from "../interfaces";

type IInput = ICriteriaCreate;

type IOutput = void;

export class CreateCriteriaUseCase {
  static async execute({ name }: IInput): Promise<IOutput> {
    const database = await databaseProjLeandroPromise;

    const existingCriteria = await database.findFirst({
      table: "criteria",
      where: { name },
    });

    if (existingCriteria) {
      throw new AppError("Criteria with this name already exists", 409);
    }

    await database.insertIntoTable({
      table: "criteria",
      dataDict: {
        name,
      },
    });
  }
}
