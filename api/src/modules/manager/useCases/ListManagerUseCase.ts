import databaseProjLeandroPromise from "../../../db/projLeandro";
import { IOrderBy, IWhere } from "../../interfaces";
import { IManagerList, IManager } from "../interfaces";

import { RetrieveManagerUseCase } from "./RetrieveManagerUseCase";

type IInput = IManagerList;

interface IOutput {
  total: number;
  pages: number;
  page: number;
  data: IManager[];
}

export class ListManagerUseCase {
  static async execute({
    order,
    select,
    sort,
    search,
    limit = 10,
    page = 1,
  }: IInput): Promise<IOutput> {
    const database = await databaseProjLeandroPromise;
    const filters = { search };
    const where: IWhere = {};
    const orderBy: IOrderBy = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === "search") {
          where["OR"] = {
            name: { value, mode: "ilike" },
          };
        } else {
          where[key] = value;
        }
      }
    });

    if (sort && order) {
      orderBy[sort] = order;
    }

    const offset = (page - 1) * limit;

    const [total, dataManager] = await Promise.all([
      database.count({
        table: "managers",
        where,
      }),
      database.findMany<{ id: number }>({
        table: "managers",
        where,
        select: { id: true },
        orderBy,
        limit,
        offset,
      }),
    ]);

    const data = await Promise.all(
      dataManager.map((manager) =>
        RetrieveManagerUseCase.execute({ id: manager.id, select }),
      ),
    );

    const pages = Math.ceil(total / limit);

    return {
      total,
      pages,
      page,
      data,
    };
  }
}
