import argparse
import sys
from typing import Any, Dict, List
from ahp_from_pairs import ahp_from_pairs
from database import get_database


def calculate_project_criteria_cr(manager_id: int, project_id: int) -> float:
    db = get_database("proj-leandro")

    pairs: List[Dict[str, Any]] = db.find_many(
        "project_criterion_pairwise_evaluations",
        joins=[{"table": "project_managers", "on": {"manager_id": "id"}}],
        where={"manager_id": manager_id, "pm.project_id": project_id},
        select={
            "rating": True,
            "criterion_a_id": True,
            "criterion_b_id": True,
        },
    )

    if not pairs:
        raise ValueError("Nenhuma avaliação encontrada para este manager/projeto")

    result = ahp_from_pairs(pairs)

    return float(result["CR"])


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Compute AHP Consistency Ratio (CR) for a manager in a project."
    )
    parser.add_argument("--manager-id", type=int, required=True, help="Manager ID")
    parser.add_argument("--project-id", type=int, required=True, help="Project ID")
    args = parser.parse_args()

    try:
        cr = calculate_project_criteria_cr(
            manager_id=args.manager_id,
            project_id=args.project_id,
        )

        print(cr)
        return 0

    except Exception as e:
        print(f"ERROR: {e}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
