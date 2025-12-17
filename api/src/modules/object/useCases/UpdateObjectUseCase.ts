import databaseProjLeandroPromise from "../../../db/projLeandro";
import { removeUndefinedValues } from "../../../utils/removeUndefinedValues";
import { IObjectDTO } from "../interfaces";

type IInput = IObjectDTO;

type IOutput = void;

export class UpdateObjectUseCase {
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

    const object = await database.findFirst<{}>({
      table: "objects",
      where: { id },
      select,
    });

    if (object) {
      let updatedDataDict: any = {};

      Object.keys(dataDict).forEach((k) => {
        if (k in object) {
          if ((dataDict as any)[k] !== (object as any)[k]) {
            updatedDataDict[k] = (dataDict as any)[k];
          }
        } else {
          updatedDataDict[k] = (dataDict as any)[k];
        }
      });

      if (Object.keys(updatedDataDict).length) {
        await database.updateIntoTable({
          table: "objects",
          dataDict: updatedDataDict,
          where: { id },
        });
      }
    }
  }
}
