import databaseProjLeandroPromise from "../../../db/projLeandro";
import { IOrderBy, IWhere } from "../../interfaces";
import { ICriteria, ICriteriaList } from "../interfaces";

import { RetrieveCriteriaUseCase } from "./RetrieveCriteriaUseCase";

type IInput = ICriteriaList;

interface IOutput {
  total: number;
  pages: number;
  page: number;
  data: ICriteria[];
}

export class ListCriteriaUseCase {
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

    const [total, dataCriteria] = await Promise.all([
      database.count({
        table: "criteria",
        where,
      }),
      database.findMany<{ id: number }>({
        table: "criteria",
        where,
        select: { id: true },
        orderBy,
        limit,
        offset,
      }),
    ]);

    const data = await Promise.all(
      dataCriteria.map((criteria) =>
        RetrieveCriteriaUseCase.execute({ id: criteria.id, select }),
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
