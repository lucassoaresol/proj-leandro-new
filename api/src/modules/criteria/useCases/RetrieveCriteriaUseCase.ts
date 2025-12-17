import databaseProjLeandroPromise from "../../../db/projLeandro";
import { AppError } from "../../../errors/appError";
import { IWhere } from "../../interfaces";
import { ICriteria, ICriteriaRetrieve } from "../interfaces";

type IInput = ICriteriaRetrieve;

type IOutput = ICriteria;

export class RetrieveCriteriaUseCase {
  static async execute({ id, select }: IInput): Promise<IOutput> {
    const database = await databaseProjLeandroPromise;
    const filters = { id };
    const where: IWhere = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        where[key] = value;
      }
    });

    const criteria = await database.findFirst<ICriteria>({
      table: "criteria",
      where,
      select,
    });

    if (!criteria) {
      throw new AppError("criteria not found", 404);
    }

    return criteria;
  }
}
