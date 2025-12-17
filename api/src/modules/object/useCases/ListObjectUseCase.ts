import databaseProjLeandroPromise from "../../../db/projLeandro";
import { IOrderBy, IWhere } from "../../interfaces";
import { IObject, IObjectList } from "../interfaces";

import { RetrieveObjectUseCase } from "./RetrieveObjectUseCase";

type IInput = IObjectList;

interface IOutput {
  total: number;
  pages: number;
  page: number;
  data: IObject[];
}

export class ListObjectUseCase {
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

    const [total, dataObject] = await Promise.all([
      database.count({
        table: "objects",
        joins: [{ table: "groups", on: { group_id: "id" } }],
        where,
      }),
      database.findMany<{ id: number }>({
        table: "objects",
        joins: [{ table: "groups", on: { group_id: "id" } }],
        where,
        select: { id: true },
        orderBy,
        limit,
        offset,
      }),
    ]);

    const data = await Promise.all(
      dataObject.map((object) =>
        RetrieveObjectUseCase.execute({ id: object.id, select }),
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
