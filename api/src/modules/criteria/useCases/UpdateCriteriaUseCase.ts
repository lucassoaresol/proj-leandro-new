import databaseProjLeandroPromise from "../../../db/projLeandro";
import { removeUndefinedValues } from "../../../utils/removeUndefinedValues";
import { ICriteriaDTO } from "../interfaces";

type IInput = ICriteriaDTO;

type IOutput = void;

export class UpdateCriteriaUseCase {
  static async execute({ id, name }: IInput): Promise<IOutput> {
    const database = await databaseProjLeandroPromise;

    const dataDict = removeUndefinedValues({
      name,
    });

    const select = Object.keys(dataDict).reduce<Record<string, boolean>>(
      (acc, key) => {
        acc[key] = true;
        return acc;
      },
      {},
    );

    const criteria = await database.findFirst<{}>({
      table: "criteria",
      where: { id },
      select,
    });

    if (criteria) {
      let updatedDataDict: any = {};

      Object.keys(dataDict).forEach((k) => {
        if (k in criteria) {
          if ((dataDict as any)[k] !== (criteria as any)[k]) {
            updatedDataDict[k] = (dataDict as any)[k];
          }
        } else {
          updatedDataDict[k] = (dataDict as any)[k];
        }
      });

      if (Object.keys(updatedDataDict).length) {
        await database.updateIntoTable({
          table: "criteria",
          dataDict: updatedDataDict,
          where: { id },
        });
      }
    }
  }
}
