import databaseProjLeandroPromise from "../../../db/projLeandro";
import { removeUndefinedValues } from "../../../utils/removeUndefinedValues";
import { IManagerDTO } from "../interfaces";

type IInput = IManagerDTO;

type IOutput = void;

export class UpdateManagerUseCase {
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

    const manager = await database.findFirst<{}>({
      table: "managers",
      where: { id },
      select,
    });

    if (manager) {
      let updatedManager: any = {};
      let updatedDataDict: any = {};

      Object.keys(dataDict).forEach((k) => {
        if (k in manager) {
          if ((dataDict as any)[k] !== (manager as any)[k]) {
            updatedManager[k] = (manager as any)[k];
            updatedDataDict[k] = (dataDict as any)[k];
          }
        } else {
          updatedDataDict[k] = (dataDict as any)[k];
        }
      });

      if (Object.keys(updatedDataDict).length) {
        await database.updateIntoTable({
          table: "managers",
          dataDict: updatedDataDict,
          where: { id },
        });

        await database.insertIntoTable({
          table: "audit_log",
          dataDict: {
            table_name: "managers",
            data_id: id,
            current_value: updatedDataDict,
            previous_value: updatedManager,
          },
        });
      }
    }
  }
}
