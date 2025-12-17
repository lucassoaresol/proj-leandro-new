import databaseProjLeandroPromise from "../../../db/projLeandro";
import { AppError } from "../../../errors/appError";
import { IWhere } from "../../interfaces";
import { IObject, IObjectRetrieve } from "../interfaces";

type IInput = IObjectRetrieve;

type IOutput = IObject;

export class RetrieveObjectUseCase {
  static async execute({ id, select }: IInput): Promise<IOutput> {
    const database = await databaseProjLeandroPromise;
    const filters = { id };
    const where: IWhere = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        where[key] = value;
      }
    });

    const object = await database.findFirst<IObject>({
      table: "objects",
      joins: [{ table: "groups", on: { group_id: "id" } }],
      where,
      select,
    });

    if (!object) {
      throw new AppError("object not found", 404);
    }

    return object;
  }
}
