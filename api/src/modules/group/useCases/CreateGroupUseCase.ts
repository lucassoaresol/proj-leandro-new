import databaseProjLeandroPromise from "../../../db/projLeandro";
import { AppError } from "../../../errors/appError";
import { IGroupCreate } from "../interfaces";

type IInput = IGroupCreate;

type IOutput = void;

export class CreateGroupUseCase {
  static async execute({ name }: IInput): Promise<IOutput> {
    const database = await databaseProjLeandroPromise;

    const existingGroup = await database.findFirst({
      table: "groups",
      where: { name },
    });

    if (existingGroup) {
      throw new AppError("Group with this name already exists", 409);
    }

    await database.insertIntoTable({
      table: "groups",
      dataDict: {
        name,
      },
    });
  }
}
