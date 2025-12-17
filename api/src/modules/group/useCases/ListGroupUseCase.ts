import databaseProjLeandroPromise from "../../../db/projLeandro";
import { IOrderBy, IWhere } from "../../interfaces";
import { IGroup, IGroupList } from "../interfaces";

import { RetrieveGroupUseCase } from "./RetrieveGroupUseCase";

type IInput = IGroupList;

interface IOutput {
  total: number;
  pages: number;
  page: number;
  data: IGroup[];
}

export class ListGroupUseCase {
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

    const [total, dataGroup] = await Promise.all([
      database.count({
        table: "groups",
        where,
      }),
      database.findMany<{ id: number }>({
        table: "groups",
        where,
        select: { id: true },
        orderBy,
        limit,
        offset,
      }),
    ]);

    const data = await Promise.all(
      dataGroup.map((group) =>
        RetrieveGroupUseCase.execute({ id: group.id, select }),
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
