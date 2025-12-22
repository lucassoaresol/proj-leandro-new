import databaseProjLeandroPromise from "../../../db/projLeandro";
import { removeUndefinedValues } from "../../../utils/removeUndefinedValues";
import { IProjectObjectCriteriaDTO } from "../interfaces";

type IInput = IProjectObjectCriteriaDTO;

type IOutput = void;

export class UpdateProjectObjectCriteriaUseCase {
  static async execute({ id, value }: IInput): Promise<IOutput> {
    const database = await databaseProjLeandroPromise;

    const dataDict = removeUndefinedValues({
      value,
    });

    const select = Object.keys(dataDict).reduce<Record<string, boolean>>(
      (acc, key) => {
        acc[key] = true;
        return acc;
      },
      {},
    );

    const projectObjectCriteria = await database.findFirst<{}>({
      table: "project_object_criteria",
      where: { id },
      select,
    });

    if (projectObjectCriteria) {
      let updatedDataDict: any = {};

      Object.keys(dataDict).forEach((k) => {
        if (k in projectObjectCriteria) {
          if ((dataDict as any)[k] !== (projectObjectCriteria as any)[k]) {
            updatedDataDict[k] = (dataDict as any)[k];
          }
        } else {
          updatedDataDict[k] = (dataDict as any)[k];
        }
      });

      if (Object.keys(updatedDataDict).length) {
        await database.updateIntoTable({
          table: "project_object_criteria",
          dataDict: updatedDataDict,
          where: { id },
        });
      }
    }
  }
}
