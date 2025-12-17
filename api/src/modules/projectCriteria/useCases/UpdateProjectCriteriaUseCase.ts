import databaseProjLeandroPromise from "../../../db/projLeandro";
import { removeUndefinedValues } from "../../../utils/removeUndefinedValues";
import { IProjectCriteriaDTO } from "../interfaces";

type IInput = IProjectCriteriaDTO;

type IOutput = void;

export class UpdateProjectCriteriaUseCase {
  static async execute({ id, optimization_goal }: IInput): Promise<IOutput> {
    const database = await databaseProjLeandroPromise;

    const dataDict = removeUndefinedValues({
      optimization_goal,
    });

    const select = Object.keys(dataDict).reduce<Record<string, boolean>>(
      (acc, key) => {
        acc[key] = true;
        return acc;
      },
      {},
    );

    const projectCriteria = await database.findFirst<{}>({
      table: "project_criteria",
      where: { id },
      select,
    });

    if (projectCriteria) {
      let updatedDataDict: any = {};

      Object.keys(dataDict).forEach((k) => {
        if (k in projectCriteria) {
          if ((dataDict as any)[k] !== (projectCriteria as any)[k]) {
            updatedDataDict[k] = (dataDict as any)[k];
          }
        } else {
          updatedDataDict[k] = (dataDict as any)[k];
        }
      });

      if (Object.keys(updatedDataDict).length) {
        await database.updateIntoTable({
          table: "project_criteria",
          dataDict: updatedDataDict,
          where: { id },
        });
      }
    }
  }
}
