import databaseProjLeandroPromise from "../../../db/projLeandro";
import { IManagerCreate } from "../interfaces";

type IInput = IManagerCreate;

type IOutput = void;

export class CreateManagerUseCase {
  static async execute({ name }: IInput): Promise<IOutput> {
    const database = await databaseProjLeandroPromise;

    await database.insertIntoTable<{ id: number }>({
      table: "managers",
      dataDict: {
        name,
      },
    });
  }
}
