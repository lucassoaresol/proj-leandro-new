import databaseProjLeandroPromise from "../../../db/projLeandro";
import { AppError } from "../../../errors/appError";
import { IObjectCreate } from "../interfaces";

type IInput = IObjectCreate;

type IOutput = void;

export class CreateObjectUseCase {
  static async execute({ group_id, name }: IInput): Promise<IOutput> {
    const database = await databaseProjLeandroPromise;

    const existingObject = await database.findFirst({
      table: "objects",
      where: { name },
    });

    if (existingObject) {
      throw new AppError("Object with this name already exists", 409);
    }

    await database.insertIntoTable({
      table: "objects",
      dataDict: {
        group_id,
        name,
      },
    });
  }
}
