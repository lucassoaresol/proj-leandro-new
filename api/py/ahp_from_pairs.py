import numpy as np

RI_TABLE = {
    1: 0.00,
    2: 0.00,
    3: 0.58,
    4: 0.90,
    5: 1.12,
    6: 1.24,
    7: 1.32,
    8: 1.41,
    9: 1.45,
    10: 1.49,
}


def ahp_from_pairs(pairs):
    criteria = sorted(
        set(p["criterion_a_id"] for p in pairs)
        | set(p["criterion_b_id"] for p in pairs)
    )

    n = len(criteria)
    if n == 0:
        raise ValueError("Nenhum critério encontrado")

    index = {cid: i for i, cid in enumerate(criteria)}

    A = np.ones((n, n), dtype=float)

    for p in pairs:
        i = index[p["criterion_a_id"]]
        j = index[p["criterion_b_id"]]
        A[i, j] = float(p["rating"])

    eigenvalues, eigenvectors = np.linalg.eig(A)
    max_idx = np.argmax(eigenvalues.real)

    lambda_max = eigenvalues.real[max_idx]
    weights = eigenvectors[:, max_idx].real
    weights = weights / weights.sum()

    CI = (lambda_max - n) / (n - 1) if n > 1 else 0
    RI = RI_TABLE.get(n, 0)
    CR = CI / RI if RI else 0

    return {
        "criteria": criteria,
        "matrix": A,
        "weights": weights,
        "lambda_max": lambda_max,
        "CI": CI,
        "CR": CR,
        "ok": CR <= 0.10,
    }
