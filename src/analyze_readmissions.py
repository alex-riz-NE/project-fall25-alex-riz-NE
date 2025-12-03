import re
from pathlib import Path
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import sql_helper
import scipy.stats as stats
import numpy as np

from flag_mappings import (
    GROUPED_PIM_LABELS, GROUPED_RISK_LABELS, GROUPED_RISK_AND_PIM_LABELS,
    COLUMN_LABEL_MAP_SUMMARY,
    COLUMN_LABEL_MAP_CHART
)

SUMMARY_DIR = Path.cwd() / "data" / "summary"
SUMMARY_DIR.mkdir(parents=True, exist_ok=True)

PLOT_DIR = Path.cwd() / "fig" / "hospital_eda"
PLOT_DIR.mkdir(parents=True, exist_ok=True)

SAVE_PLOTS = True


def load_final_table(final_table, save_csv=False):
    base_path = Path.cwd().parent / "data"
    base_path.mkdir(exist_ok=True)
    file_path = base_path / "hospital_readmission.csv"
    if file_path.is_file():
        df = pd.read_csv(file_path)
        return df, len(df)
    else:
        conn = sql_helper.connect_server()
        df = sql_helper.query_to_table(f"SELECT * FROM {final_table};", conn)
        df.to_csv(file_path, index=False)
        conn.close()
        return df, len(df)


def save_plot(filename):
    if SAVE_PLOTS:
        plt.savefig(PLOT_DIR / filename, dpi=300, bbox_inches="tight")


def slugify(label):
    return re.sub(r"[^a-z0-9]+", "_", label.lower()).strip("_")


def write_text_block(path, title, dataframe=None, text=None):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "a", encoding="utf-8") as f:
        f.write("\n" + "=" * 90 + "\n")
        f.write(title + "\n")
        f.write("=" * 90 + "\n\n")
        if text:
            f.write(text.strip() + "\n\n")
        if dataframe is not None:
            f.write(dataframe.to_string(index=False) + "\n\n")


def summarize_binary_flags(df_all, df_a, df_b, cols, label, label_map, plot=True, save_to_file=None):
    rows = []
    total_all = len(df_all)
    total_a = len(df_a)
    total_b = len(df_b)
    for c in cols:
        n_all = df_all[c].sum()
        n_a = df_a[c].sum()
        n_b = df_b[c].sum()
        rows.append({
            "label": label_map[c],
            "n_all": n_all,
            "n_aphasia": n_a,
            "pct_aphasia": n_a / total_a if total_a else 0,
            "n_no_aphasia": n_b,
            "pct_no_aphasia": n_b / total_b if total_b else 0,
            "diff_aphasia_minus_no": (
                (n_a / total_a * 100 if total_a else 0) -
                (n_b / total_b * 100 if total_b else 0)
            )
        })
    df = pd.DataFrame(rows).sort_values("pct_aphasia", ascending=False)
    if save_to_file:
        write_text_block(save_to_file, label, dataframe=df.rename(columns=COLUMN_LABEL_MAP_SUMMARY))
    if plot:
        p = df.melt(
            id_vars=["label"],
            value_vars=["pct_aphasia", "pct_no_aphasia"],
            var_name="Group",
            value_name="Percent"
        )
        p["Group"] = p["Group"].map(COLUMN_LABEL_MAP_CHART)
        plt.figure(figsize=(10, 5))
        sns.barplot(data=p, x="label", y="Percent", hue="Group")
        plt.xticks(rotation=45, ha="right")
        plt.title(label)
        plt.tight_layout()
        save_plot(f"{slugify(label)}.png")
        plt.close()
    return df


def chi2_flag(flag, readmission):
    tab = pd.crosstab(readmission["has_aphasia"], readmission[flag])
    chi2, p, dof, exp = stats.chi2_contingency(tab)
    return tab, chi2, p


def odds_ratio(df, flag, outcome):
    tab = pd.crosstab(df[flag], df[outcome])
    a = tab.loc[1, 1] if (1 in tab.index and 1 in tab.columns) else 0
    b = tab.loc[1, 0] if (1 in tab.index and 0 in tab.columns) else 0
    c = tab.loc[0, 1] if (0 in tab.index and 1 in tab.columns) else 0
    d = tab.loc[0, 0] if (0 in tab.index and 0 in tab.columns) else 0
    if b * c == 0:
        or_val = np.nan
    else:
        or_val = (a * d) / (b * c)
    chi2, p, dof, exp = stats.chi2_contingency(tab)
    return tab, or_val, p


def format_chi_square(flag, tab, chi2, p):
    # Extract counts with safety fallback
    a00 = tab.loc[0, 0] if (0 in tab.index and 0 in tab.columns) else 0
    a01 = tab.loc[0, 1] if (0 in tab.index and 1 in tab.columns) else 0
    a10 = tab.loc[1, 0] if (1 in tab.index and 0 in tab.columns) else 0
    a11 = tab.loc[1, 1] if (1 in tab.index and 1 in tab.columns) else 0

    return f"""
================= CHI-SQUARE TEST: {flag} =================

                {flag} = 0        {flag} = 1
--------------------------------------------------------
Aphasia = 0      {a00:>7,}          {a01:>7,}
Aphasia = 1      {a10:>7,}          {a11:>7,}

Chi-square statistic:   {chi2:.3f}
p-value:                {p:.5f}

--------------------------------------------------------
"""


def write_chi_square_and_odds(readmission_no_dementia, save_to_file):
    """
    Writes chi-square tests and unadjusted odds ratios
    for PIM and polypharmacy → readmission outcomes
    to a text file using your write_text_block function.
    """
    # -----------------------
    # 1. Chi-square tests
    # -----------------------
    chi_text = "=== CHI-SQUARE TESTS: APHASIA vs (PIM, POLYPHARMACY) ===\n"

    for flag in ["any_pim", "has_polypharmacy"]:
        tab, chi2, p = chi2_flag(flag, readmission_no_dementia)
        chi_text += format_chi_square(flag, tab, chi2, p)

    write_text_block(
        save_to_file,
        "CHI-SQUARE TESTS (PIM & POLYPHARMACY)",
        text=chi_text
    )

    # -----------------------
    # 2. Unadjusted odds ratios
    # -----------------------
    or_text = "=== UNADJUSTED ODDS RATIOS (PIM, POLYPHARMACY → READMISSION) ===\n"

    for outcome in ["readmit_30d", "readmit_90d", "readmit_180d"]:
        or_text += f"\n--- Outcome: {outcome} ---\n"
        for flag in ["any_pim", "has_polypharmacy"]:
            tab, or_val, p = odds_ratio(readmission_no_dementia, flag, outcome)
            or_text += f"\n{flag} → {outcome}\n"
            or_text += f"{tab.to_string()}\n"
            or_text += f"Odds Ratio = {or_val:.3f}\n"
            or_text += f"p = {p:.4g}\n"

    write_text_block(
        save_to_file,
        "UNADJUSTED ODDS RATIOS (PIM, POLYPHARMACY)",
        text=or_text
    )


def summarize_readmission(flag_table, save_to_file=None):

    df_nd = flag_table[flag_table["has_dementia"] == 0].copy()

    # Define horizons
    horizons = {
        "30d": "readmission_30d",
        "90d": "readmission_90d",
        "180d": "readmission_180d"
    }

    # Containers for combined tables
    prevalence_rows = []
    count_rows = []
    pim_rows = []
    risk_rows = []

    total_all = len(df_nd)
    total_aph = df_nd[df_nd["has_aphasia"] == 1].shape[0]
    total_no = df_nd[df_nd["has_aphasia"] == 0].shape[0]

    # LOOP THROUGH 30d / 90d / 180d
    for label, col in horizons.items():

        df_nd[f"has_readmit_{label}"] = (df_nd[col] > 0).astype(int)

        n_all = df_nd[f"has_readmit_{label}"].sum()
        n_aph = df_nd[df_nd["has_aphasia"] == 1][f"has_readmit_{label}"].sum()
        n_no = df_nd[df_nd["has_aphasia"] == 0][f"has_readmit_{label}"].sum()

        # ---------------- PREVALENCE ----------------
        prevalence_rows.append({
            "Horizon": label,
            "# All": n_all,
            "% All": (n_all / total_all) * 100,
            "# Aphasia": n_aph,
            "% Aphasia": (n_aph / total_aph) * 100,
            "# No Aphasia": n_no,
            "% No Aphasia": (n_no / total_no) * 100,
            "% Diff": ((n_aph / total_aph) - (n_no / total_no)) * 100
        })

        # ---------------- READMISSION COUNT ----------------
        count_rows.extend([
            {"Horizon": label, "Group": "All",
             "Mean": df_nd[col].mean(), "Median": df_nd[col].median()},
            {"Horizon": label, "Group": "Aphasia",
             "Mean": df_nd[df_nd["has_aphasia"] == 1][col].mean(),
             "Median": df_nd[df_nd["has_aphasia"] == 1][col].median()},
            {"Horizon": label, "Group": "No Aphasia",
             "Mean": df_nd[df_nd["has_aphasia"] == 0][col].mean(),
             "Median": df_nd[df_nd["has_aphasia"] == 0][col].median()},
        ])

        # ---------------- PIM GROUPS ----------------
        for flag in GROUPED_PIM_LABELS:
            df_flag = df_nd[df_nd[flag] == 1]
            if len(df_flag) == 0:
                continue

            aph = df_flag[df_flag["has_aphasia"] == 1][col]
            no = df_flag[df_flag["has_aphasia"] == 0][col]

            pim_rows.append({
                "Horizon": label,
                "Category": GROUPED_RISK_AND_PIM_LABELS.get(flag, flag),
                "Pct Aphasia": (aph > 0).mean() * 100 if len(aph) else 0,
                "Pct No Aphasia": (no > 0).mean() * 100 if len(no) else 0,
                "Diff": ((aph > 0).mean() - (no > 0).mean()) * 100,
                "Mean Aph": aph.mean() if len(aph) else 0,
                "Mean No": no.mean() if len(no) else 0,
                "Mean Diff Abs": abs((aph.mean() - no.mean()))
            })

        # ---------------- AT-RISK GROUPS ----------------
        for flag in GROUPED_RISK_LABELS:
            df_flag = df_nd[df_nd[flag] == 1]
            if len(df_flag) == 0:
                continue

            aph = df_flag[df_flag["has_aphasia"] == 1][col]
            no = df_flag[df_flag["has_aphasia"] == 0][col]

            risk_rows.append({
                "Horizon": label,
                "Category": GROUPED_RISK_AND_PIM_LABELS.get(flag, flag),
                "Pct Aphasia": (aph > 0).mean() * 100 if len(aph) else 0,
                "Pct No Aphasia": (no > 0).mean() * 100 if len(no) else 0,
                "Diff": ((aph > 0).mean() - (no > 0).mean()) * 100,
                "Mean Aph": aph.mean() if len(aph) else 0,
                "Mean No": no.mean() if len(no) else 0,
                "Mean Diff Abs": abs((aph.mean() - no.mean()))
            })

    # ==================================================
    # BUILD FINAL COMBINED TABLES
    # ==================================================
    prevalence_df = pd.DataFrame(prevalence_rows)
    count_df = pd.DataFrame(count_rows)
    pim_df = pd.DataFrame(pim_rows)
    risk_df = pd.DataFrame(risk_rows)

    # Write once per table
    if save_to_file:
        write_text_block(save_to_file, "READMISSION PREVALENCE (ALL HORIZONS)", dataframe=prevalence_df)
        write_text_block(save_to_file, "READMISSION COUNT SUMMARY (ALL HORIZONS)", dataframe=count_df)
        write_text_block(save_to_file, "PIM CATEGORY READMISSION (ALL HORIZONS)", dataframe=pim_df)
        write_text_block(save_to_file, "AT-RISK CATEGORY READMISSION (ALL HORIZONS)", dataframe=risk_df)

    return {
        "prevalence": prevalence_df,
        "summary": count_df,
        "pim": pim_df,
        "risk": risk_df
    }


if __name__ == "__main__":
    final_table = 'work_rizvanov_a263.stroke_cohort_with_readmission_counts'
    save_path = SUMMARY_DIR / "readmission_aphasia_summary.txt"
    flag_table, n = load_final_table(final_table)
    readmission_no_dementia = flag_table[flag_table["has_dementia"] == 0].copy()
    readmission_no_dementia["readmit_30d"] = (readmission_no_dementia["readmission_30d"] > 0).astype(int)
    readmission_no_dementia["readmit_90d"] = (readmission_no_dementia["readmission_90d"] > 0).astype(int)
    readmission_no_dementia["readmit_180d"] = (readmission_no_dementia["readmission_180d"] > 0).astype(int)

    summarize_readmission(readmission_no_dementia, save_to_file=save_path)
    write_chi_square_and_odds(readmission_no_dementia, save_to_file=save_path)
