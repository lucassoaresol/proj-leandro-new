import databaseProjLeandroPromise from "../../../db/projLeandro";
import { removeUndefinedValues } from "../../../utils/removeUndefinedValues";
import { IProjectManagerDTO } from "../interfaces";

type IInput = IProjectManagerDTO;

type IOutput = void;

export class UpdateProjectManagerUseCase {
  static async execute({ id, importance_weight }: IInput): Promise<IOutput> {
    const database = await databaseProjLeandroPromise;

    const dataDict = removeUndefinedValues({
      importance_weight,
    });

    const select = Object.keys(dataDict).reduce<Record<string, boolean>>(
      (acc, key) => {
        acc[key] = true;
        return acc;
      },
      {},
    );

    const projectManager = await database.findFirst<{}>({
      table: "project_managers",
      where: { id },
      select,
    });

    if (projectManager) {
      let updatedDataDict: any = {};

      Object.keys(dataDict).forEach((k) => {
        if (k in projectManager) {
          if ((dataDict as any)[k] !== (projectManager as any)[k]) {
            updatedDataDict[k] = (dataDict as any)[k];
          }
        } else {
          updatedDataDict[k] = (dataDict as any)[k];
        }
      });

      if (Object.keys(updatedDataDict).length) {
        await database.updateIntoTable({
          table: "project_managers",
          dataDict: updatedDataDict,
          where: { id },
        });
      }
    }
  }
}
