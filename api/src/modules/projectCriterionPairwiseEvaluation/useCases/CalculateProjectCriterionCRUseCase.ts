import { AppError } from "../../../errors/appError";
import { runPythonScript } from "../../../utils/runPythonScript";
import { IProjectCriterionCRCalculate } from "../interfaces";

type IInput = IProjectCriterionCRCalculate;
type IOutput = {
  cr: number;
  is_consistent: boolean;
};

const CR_THRESHOLD = 0.1;

export class CalculateProjectCriterionCRUseCase {
  static async execute({ manager_id, project_id }: IInput): Promise<IOutput> {
    const raw = await runPythonScript(
      "./py/calculate_project_criteria_weights.py",
      [
        "--manager-id",
        manager_id.toString(),
        "--project-id",
        project_id.toString(),
      ],
    );

    const cr = Number(String(raw).trim());

    if (Number.isNaN(cr)) {
      throw new AppError(
        "Internal error while calculating consistency ratio (invalid result from calculation service)",
        500,
      );
    }

    return {
      cr,
      is_consistent: cr <= CR_THRESHOLD,
    };
  }
}
