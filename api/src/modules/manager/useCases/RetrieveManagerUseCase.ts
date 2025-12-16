import databaseProjLeandroPromise from "../../../db/projLeandro";
import { AppError } from "../../../errors/appError";
import { IWhere } from "../../interfaces";
import { IManager, IManagerRetrieve } from "../interfaces";

type IInput = IManagerRetrieve;

type IOutput = IManager;

export class RetrieveManagerUseCase {
  static async execute({ id, select }: IInput): Promise<IOutput> {
    const database = await databaseProjLeandroPromise;
    const filters = { id };
    const where: IWhere = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        where[key] = value;
      }
    });

    const manager = await database.findFirst<IManager>({
      table: "managers",
      where,
      select,
    });

    if (!manager) {
      throw new AppError("manager not found", 404);
    }

    return manager;
  }
}
