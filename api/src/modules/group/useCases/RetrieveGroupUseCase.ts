import databaseProjLeandroPromise from "../../../db/projLeandro";
import { AppError } from "../../../errors/appError";
import { IWhere } from "../../interfaces";
import { IGroup, IGroupRetrieve } from "../interfaces";

type IInput = IGroupRetrieve;

type IOutput = IGroup;

export class RetrieveGroupUseCase {
  static async execute({ id, select }: IInput): Promise<IOutput> {
    const database = await databaseProjLeandroPromise;
    const filters = { id };
    const where: IWhere = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        where[key] = value;
      }
    });

    const group = await database.findFirst<IGroup>({
      table: "groups",
      where,
      select,
    });

    if (!group) {
      throw new AppError("group not found", 404);
    }

    return group;
  }
}
