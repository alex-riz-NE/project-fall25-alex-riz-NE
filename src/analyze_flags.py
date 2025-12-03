import re
from pathlib import Path
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import sql_helper

from flag_mappings import (
    MH_LABELS, MED_LABELS, GROUPED_PIM_LABELS, GROUPED_RISK_LABELS,
    SPECIFIC_PIM_LABELS, UNDER_TREAT_LABELS, POLY_LABELS,
    pim_cols, pim_labels,
    risk_cols, risk_labels,
    ALL_LABEL_MAP,
    COLUMN_LABEL_MAP_SUMMARY,
    COLUMN_LABEL_MAP_CHART
)
sns.set(style="whitegrid")

SUMMARY_DIR = Path.cwd() / "data" / "summary"
SUMMARY_DIR.mkdir(parents=True, exist_ok=True)

PLOT_DIR = Path.cwd() / "fig" / "flag_eda"
PLOT_DIR.mkdir(parents=True, exist_ok=True)

SAVE_PLOTS = True

def is_binary_numeric(col):
    try:
        # Try converting everything to int 0/1
        vals = pd.to_numeric(col.dropna(), errors='raise').astype(int)
        return set(vals.unique()).issubset({0, 1})
    except Exception:
        return False
    
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


def load_final_table(final_table,save_csv=False):
    file_path = Path(__file__).resolve().parent.parent / "data"/"flag_table.csv"
    if file_path.is_file():
        df=pd.read_csv(file_path)
        return df, len(df)
    else:
        conn = sql_helper.connect_server()
        df = sql_helper.query_to_table(f"SELECT * FROM {final_table};", conn)
        df.to_csv(file_path)
        conn.close()
        return df, len(df)

def filter_dementia(df, dementia_col="has_dementia", plot=True, save_to_file=None):
    n_before = len(df)
    df_out = df[df[dementia_col] == 0].copy()
    n_after = len(df_out)
    removed = n_before - n_after
    pct = removed / n_before * 100 if n_before else 0
    text = (
        f"Initial cohort size:   {n_before:,}\n"
        f"Dementia removed:      {removed:,} ({pct:.2f}%)\n"
        f"After removal:         {n_after:,}"
    )
    if save_to_file:
        write_text_block(save_to_file, "DEMENTIA FILTER SUMMARY", text=text)
    if plot:
        plot_df = pd.DataFrame({"Group": ["No dementia", "Removed"], "Count": [n_after, removed]})
        plt.figure(figsize=(5, 4))
        sns.barplot(data=plot_df, x="Group", y="Count")
        plt.title("Cohort Before/After Dementia Exclusion")
        plt.tight_layout()
        save_plot("dementia_filter_summary.png")
        plt.close()
    return df_out, n_before, n_after, removed

def split_aphasia_groups(df, aphasia_col="has_aphasia", plot=True, save_to_file=None):
    aph = df[df[aphasia_col] == 1].copy()
    no_aph = df[df[aphasia_col] == 0].copy()
    n = len(df)
    na = len(aph)
    nb = len(no_aph)
    pa = na / n * 100 if n else 0
    pb = nb / n * 100 if n else 0
    text = (
        f"Total cohort:     {n:,}\n"
        f"Aphasia:          {na:,} ({pa:.2f}%)\n"
        f"No aphasia:       {nb:,} ({pb:.2f}%)"
    )
    if save_to_file:
        write_text_block(save_to_file, "APHASIA SPLIT SUMMARY", text=text)
    if plot:
        plot_df = pd.DataFrame({"Group": ["Aphasia", "No Aphasia"], "Count": [na, nb]})
        plt.figure(figsize=(5, 4))
        sns.barplot(data=plot_df, x="Group", y="Count")
        plt.title("Aphasia Split")
        plt.tight_layout()
        save_plot("aphasia_split_summary.png")
        plt.close()
    return aph, no_aph, na, nb

def summarize_all_flags(df,ALL_LABEL_MAP):
    flag_cols = sorted([
        c for c in df.columns
        if c != "has_aphasia" and is_binary_numeric(df[c])
    ])
    counts = df[flag_cols].astype(int).sum()
    percents = counts /  len(df) * 100
    labels = [ALL_LABEL_MAP.get(c, c) for c in flag_cols]
    flag_df= pd.DataFrame({
        "flag": labels,
        "count_1": counts.values,
        "percent_1": percents.values
    })
    flag_df = flag_df.sort_values("flag", ascending=True)

    flag_df = flag_df[["flag", "count_1", "percent_1"]].reset_index(drop=True)
    flag_df = flag_df.sort_values("flag", ascending=True)
    n = len(flag_df)
    mid = (n + 1) // 2  # top half and bottom half

    left = flag_df.iloc[:mid].reset_index(drop=True)
    right = flag_df.iloc[mid:].reset_index(drop=True)

    left = left.add_prefix("left_")
    right = right.add_prefix("right_")

    paired = pd.concat([left, right], axis=1)
    return paired



def summarize_flags_by_aphasia(df, aph, no_aph, label_map):
    flag_cols = sorted([
        c for c in df.columns
        if c != "has_aphasia" and is_binary_numeric(df[c])
    ])

    # Vectorized counts
    aph_counts = aph[flag_cols].apply(pd.to_numeric, errors="coerce").fillna(0).astype(int).sum()
    no_counts  = no_aph[flag_cols].apply(pd.to_numeric, errors="coerce").fillna(0).astype(int).sum()

    # Vectorized percentages
    aph_pct = aph_counts / len(aph) * 100
    no_pct  = no_counts  / len(no_aph) * 100

    # Difference
    diff_pct = aph_pct - no_pct

    # Human-readable labels
    labels = [label_map.get(c, c) for c in flag_cols]
    print(labels)

    flag_df= pd.DataFrame({
        "flag": labels,
        "aphasia_1": aph_counts.values,
        "aphasia_pct": aph_pct.values,
        "no_aphasia_1": no_counts.values,
        "no_aphasia_pct": no_pct.values,
        "difference_pct": diff_pct.values
    })

    return flag_df.sort_values("flag", ascending=True)
 

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
            "pct_all": n_all / total_all * 100 if total_all else 0,
            "n_aphasia": n_a,
            "pct_aphasia": n_a / total_a * 100 if total_a else 0,
            "n_no_aphasia": n_b,
            "pct_no_aphasia": n_b / total_b * 100 if total_b else 0,
            "pct_diff_aphasia_minus_no": (
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

def summarize_polypharmacy_counts(df_all, df_a, df_b, save_to_file=None, plot=True):
    def stats(s):
        return {"mean": s.mean() if len(s) else 0,
                "median": s.median() if len(s) else 0}
    all_s = stats(df_all["polypharmacy_count"])
    a_s = stats(df_a["polypharmacy_count"])
    b_s = stats(df_b["polypharmacy_count"])
    summary_df = pd.DataFrame({
        "Group": ["All Patients", "Aphasia", "No Aphasia"],
        "Mean Polypharmacy Count": [all_s["mean"], a_s["mean"], b_s["mean"]],
        "Median Polypharmacy Count": [all_s["median"], a_s["median"], b_s["median"]]
    })
    if save_to_file:
        write_text_block(save_to_file, "POLYPHARMACY COUNT SUMMARY", dataframe=summary_df)
    if plot:
        plt.figure(figsize=(10, 5))
        sns.kdeplot(df_all["polypharmacy_count"], label="All Patients")
        sns.kdeplot(df_a["polypharmacy_count"], label="Aphasia")
        sns.kdeplot(df_b["polypharmacy_count"], label="No Aphasia")
        plt.title("Polypharmacy Count Distribution")
        plt.legend()
        plt.tight_layout()
        save_plot("polypharmacy_count_distribution.png")
        plt.close()
    return summary_df

def plot_pim_risk_polypharmacy(df, aph, no_aph, save_to_file=None, plot=True):
    def compute(df_a, df_b, cols, labels):
        rows = []
        total_a = len(df_a)
        total_b = len(df_b)
        for c in cols:
            rows.append({
                "label": labels[c],
                "pct_aphasia_poly":
                    (((df_a[c] == 1) & (df_a["has_polypharmacy"] == 1)).sum() / total_a) * 100,
                "pct_no_aphasia_poly":
                    (((df_b[c] == 1) & (df_b["has_polypharmacy"] == 1)).sum() / total_b) * 100
            })
        return pd.DataFrame(rows)

    pim_df = compute(aph, no_aph, pim_cols, pim_labels)
    risk_df = compute(aph, no_aph, risk_cols, risk_labels)

    if save_to_file:
        write_text_block(save_to_file, "POLYPHARMACY BY PIM CATEGORY (Aphasia vs No Aphasia)", dataframe=pim_df)
        write_text_block(save_to_file, "POLYPHARMACY BY AT-RISK CATEGORY (Aphasia vs No Aphasia)", dataframe=risk_df)

    if plot:
        for df_plot, title, fname in [
            (pim_df, "Polypharmacy % by PIM Category (Aphasia-Segmented)", "polypharmacy_by_pim_segmented.png"),
            (risk_df, "Polypharmacy % by At-Risk Category (Aphasia-Segmented)", "polypharmacy_by_risk_segmented.png")
        ]:
            melted = df_plot.melt(
                id_vars="label",
                value_vars=["pct_aphasia_poly", "pct_no_aphasia_poly"],
                var_name="Group",
                value_name="Polypharmacy %"
            )
            melted["Group"] = melted["Group"].map({
                "pct_aphasia_poly": "Aphasia",
                "pct_no_aphasia_poly": "No Aphasia"
            })

            plt.figure(figsize=(12, 6))
            sns.barplot(data=melted, x="label", y="Polypharmacy %", hue="Group")
            plt.xticks(rotation=45, ha="right")
            plt.title(title)
            plt.tight_layout()
            save_plot(fname)
            plt.close()

    return pim_df, risk_df


def run_basic_aphasia_pim_analysis(final_table, save_to_file, plot=True):
    save_to_file = Path(save_to_file)
    with open(save_to_file, "w", encoding="utf-8") as f:
        f.write("APHASIA–PIM ANALYSIS SUMMARY\n" + "=" * 90 + "\n\n")
    df_raw, n_start = load_final_table(final_table)
    df_clean, _, n_after, _ = filter_dementia(df_raw, plot=plot, save_to_file=save_to_file)
    aph, no_aph, na2, nb2 = split_aphasia_groups(df_clean, plot=plot, save_to_file=save_to_file)
    text = (
        f"Initial population:     {n_start:,}\n"
        f"After dementia filter:  {n_after:,}\n"
        f"Aphasia:                {na2:,}\n"
        f"No aphasia:             {nb2:,}"
    )

    write_text_block(save_to_file, "COHORT COUNT SUMMARY", text=text)
    # flag_summary = summarize_all_flags(df_clean)
    # write_text_block(save_to_file, "ALL FLAG COUNTS (Total Population)", dataframe=flag_summary)

    flag_summary = summarize_all_flags(df_clean, ALL_LABEL_MAP)
    write_text_block( save_to_file, "ALL FLAG COUNTS (Two Flags per Row)", dataframe=flag_summary)
    
    # Aphasia vs No-Aphasia flag counts
    flag_summary_aph = summarize_flags_by_aphasia(df_clean, aph, no_aph, ALL_LABEL_MAP)
    write_text_block(save_to_file, "ALL FLAG COUNTS (Aphasia vs No Aphasia)", dataframe=flag_summary_aph)
    summarize_binary_flags(
        df_clean, aph, no_aph,
        list(MH_LABELS.keys()),
        "Mental Health Conditions (Aphasia vs No Aphasia)",
        MH_LABELS, plot, save_to_file
    )
    summarize_binary_flags(
        df_clean, aph, no_aph,
        list(MED_LABELS.keys()),
        "Medication Class Use (Aphasia vs No Aphasia)",
        MED_LABELS, plot, save_to_file
    )
    summarize_binary_flags(
        df_clean, aph, no_aph,
        list(GROUPED_PIM_LABELS.keys()),
        "Grouped PIM Rates (Aphasia vs No Aphasia)",
        GROUPED_PIM_LABELS, plot, save_to_file
    )
    summarize_binary_flags(
        df_clean, aph, no_aph,
        list(GROUPED_RISK_LABELS.keys()),
        "At-Risk Medication Use (Aphasia vs No Aphasia)",
        GROUPED_RISK_LABELS, plot, save_to_file
    )
    summarize_binary_flags(
        df_clean, aph, no_aph,
        list(SPECIFIC_PIM_LABELS.keys()),
        "Specific PIMs (Prescribed Without Condition)",
        SPECIFIC_PIM_LABELS, plot, save_to_file
    )
    summarize_binary_flags(
        df_clean, aph, no_aph,
        list(UNDER_TREAT_LABELS.keys()),
        "Under-Treatment Rates",
        UNDER_TREAT_LABELS, plot, save_to_file
    )
    summarize_binary_flags(
        df_clean, aph, no_aph,
        list(POLY_LABELS.keys()),
        "Polypharmacy Prevalence",
        POLY_LABELS, plot, save_to_file
    )
    if "polypharmacy_count" in df_clean.columns:
        summarize_polypharmacy_counts(df_clean, aph, no_aph, save_to_file, plot)
    plot_pim_risk_polypharmacy(df_clean, aph, no_aph, save_to_file, plot)

if __name__ == "__main__":
    save_path = SUMMARY_DIR / "aphasia_pim_risk_summary.txt"
    run_basic_aphasia_pim_analysis(
        "work_rizvanov_a263.stroke_cohort_flag_polypharmacy",
        save_path,
        plot=True
    )
