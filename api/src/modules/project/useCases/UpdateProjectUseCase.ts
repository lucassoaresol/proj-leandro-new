import databaseProjLeandroPromise from "../../../db/projLeandro";
import { removeUndefinedValues } from "../../../utils/removeUndefinedValues";
import { IProjectDTO } from "../interfaces";

type IInput = IProjectDTO;

type IOutput = void;

export class UpdateProjectUseCase {
  static async execute({
    id,
    name,
    description,
    started_at,
    ended_at,
  }: IInput): Promise<IOutput> {
    const database = await databaseProjLeandroPromise;

    const dataDict = removeUndefinedValues({
      name,
      description,
      started_at,
      ended_at,
    });

    const select = Object.keys(dataDict).reduce<Record<string, boolean>>(
      (acc, key) => {
        acc[key] = true;
        return acc;
      },
      {},
    );

    const project = await database.findFirst<{}>({
      table: "projects",
      where: { id },
      select,
    });

    if (project) {
      let updatedDataDict: any = {};

      Object.keys(dataDict).forEach((k) => {
        if (k in project) {
          if ((dataDict as any)[k] !== (project as any)[k]) {
            updatedDataDict[k] = (dataDict as any)[k];
          }
        } else {
          updatedDataDict[k] = (dataDict as any)[k];
        }
      });

      if (Object.keys(updatedDataDict).length) {
        await database.updateIntoTable({
          table: "projects",
          dataDict: updatedDataDict,
          where: { id },
        });
      }
    }
  }
}
