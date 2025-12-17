import databaseProjLeandroPromise from "../../../db/projLeandro";
import { removeUndefinedValues } from "../../../utils/removeUndefinedValues";
import { IGroupDTO } from "../interfaces";

type IInput = IGroupDTO;

type IOutput = void;

export class UpdateGroupUseCase {
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

    const group = await database.findFirst<{}>({
      table: "groups",
      where: { id },
      select,
    });

    if (group) {
      let updatedDataDict: any = {};

      Object.keys(dataDict).forEach((k) => {
        if (k in group) {
          if ((dataDict as any)[k] !== (group as any)[k]) {
            updatedDataDict[k] = (dataDict as any)[k];
          }
        } else {
          updatedDataDict[k] = (dataDict as any)[k];
        }
      });

      if (Object.keys(updatedDataDict).length) {
        await database.updateIntoTable({
          table: "groups",
          dataDict: updatedDataDict,
          where: { id },
        });
      }
    }
  }
}
