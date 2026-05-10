import databaseProjLeandroPromise from "../../../db/projLeandro";
import { removeUndefinedValues } from "../../../utils/removeUndefinedValues";
import { IProjectCreate } from "../interfaces";

type IInput = IProjectCreate;

type IOutput = void;

export class CreateProjectUseCase {
  static async execute({
    name,
    description,
    started_at,
    ended_at,
    status,
  }: IInput): Promise<IOutput> {
    const database = await databaseProjLeandroPromise;

    await database.insertIntoTable({
      table: "projects",
      dataDict: removeUndefinedValues({
        name,
        description,
        started_at,
        ended_at,
        status,
      }),
    });
  }
}
