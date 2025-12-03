MH_LABELS = {
    "has_depression": "Depression",
    "has_anxiety": "Anxiety",
    "has_ptsd": "PTSD",
    "has_seizure": "Seizure/Epilepsy",
    "has_bipolar": "Bipolar Disorder",
    "has_psychosis": "Psychosis",
    "has_schizo": "Schizophrenia",
}

MED_LABELS = {
    "took_antidep": "Antidepressant",
    "took_anxiolytic": "Anxiolytic",
    "took_hyp_sed": "Sedative/Hypnotic",
    "took_antipsych": "Antipsychotic",
}

GROUPED_PIM_LABELS = {
    "antidepressant_pim": "Antidepressant PIM",
    "antipsychotic_pim": "Antipsychotic PIM",
    "anxiolytic_pim": "Anxiolytic PIM",
    "sedative_pim": "Sedative/Hypnotic PIM",
}

GROUPED_RISK_LABELS = {
    "at_risk_sedative": "At-Risk (Sedative/Hypnotic)",
    "at_risk_anxiolytic": "At-Risk (Anxiolytic)",
    "at_risk_antidepressant": "At-Risk (Antidepressant)",
    "at_risk_antipsychotic": "At-Risk (Antipsychotic)",
}

SPECIFIC_PIM_LABELS = {
    "prescribed_no_condition_ptsd_ad": "AD w/o PTSD",
    "prescribed_no_condition_anxiety_ad": "AD w/o Anxiety",
    "prescribed_no_condition_depression": "AD w/o Depression",
    "prescribed_no_condition_ptsd_ano": "Anx w/o PTSD",
    "prescribed_no_condition_seizure_ano": "Anx w/o Seizure",
    "prescribed_no_condition_anxiety_ano": "Anx w/o Anxiety",
    "prescribed_no_condition_ptsd_sed": "Sed/Hyp w/o PTSD",
    "prescribed_no_condition_seizure_sed": "Sed/Hyp w/o Seizure",
    "prescribed_no_condition_anxiety_sed": "Sed/Hyp w/o Anxiety",
    "prescribed_no_condition_schizo": "AP w/o Schizophrenia",
    "prescribed_no_condition_psychosis": "AP w/o Psychosis",
    "prescribed_no_condition_bipolar": "AP w/o Bipolar",
}

UNDER_TREAT_LABELS = {
    "condition_not_prescribed_anxiety_sed": "Anxiety — No Sed/Hyp",
    "condition_not_prescribed_anxiety_ano": "Anxiety — No Anx",
    "condition_not_prescribed_seizure_sed": "Seizure — No Sed/Hyp",
    "condition_not_prescribed_seizure_ano": "Seizure — No Anx",
    "condition_not_prescribed_depression": "Depression — No AD",
    "condition_not_prescribed_psychosis": "Psychosis — No AP",
    "condition_not_prescribed_bipolar": "Bipolar — No AP",
    "condition_not_prescribed_ptsd_sed": "PTSD — No Sed/Hyp",
    "condition_not_prescribed_ptsd_ano": "PTSD — No Anx",
    "condition_not_prescribed_schizo": "Schizophrenia — No AP",
}

POLY_LABELS = {
    "has_polypharmacy": "Has Polypharmacy"
}

COLUMN_LABEL_MAP_SUMMARY = {
    "label": "Patient Characteristic",
    "n_all": "# (All Patients)",
    "pct_all": "% (All Patients)",
    "n_aphasia": "# (Aphasia)",
    "pct_aphasia": "% (Aphasia)",
    "n_no_aphasia": "# (No Aphasia)",
    "pct_no_aphasia": "% (No Aphasia)",
    "pct_diff_aphasia_minus_no": "% Difference (Aphasia − No Aphasia)"
}

COLUMN_LABEL_MAP_CHART = {
    "pct_aphasia": "Aphasia",
    "pct_no_aphasia": "No Aphasia"
}

pim_cols = [
        "antidepressant_pim",
        "antipsychotic_pim",
        "anxiolytic_pim",
        "sedative_pim"
    ]
pim_labels = {
    "antidepressant_pim": "PIM: Antidepressant",
    "antipsychotic_pim": "PIM: Antipsychotic",
    "anxiolytic_pim": "PIM: Anxiolytic",
    "sedative_pim": "PIM: Sed/Hypnotic"
}

risk_cols = [
    "at_risk_sedative",
    "at_risk_anxiolytic",
    "at_risk_antidepressant",
    "at_risk_antipsychotic"
]
risk_labels = {
    "at_risk_sedative": "At-Risk: Sed/Hypnotic",
    "at_risk_anxiolytic": "At-Risk: Anxiolytic",
    "at_risk_antidepressant": "At-Risk: Antidepressant",
    "at_risk_antipsychotic": "At-Risk: Antipsychotic"
}
GROUPED_RISK_AND_PIM_LABELS = {
    "antidepressant_pim": "PIM: Antidepressant",
    "antipsychotic_pim": "PIM: Antipsychotic",
    "anxiolytic_pim": "PIM: Anxiolytic",
    "sedative_pim": "PIM: Sed/Hypnotic",
    "at_risk_sedative": "At-Risk: Sed/Hypnotic",
    "at_risk_anxiolytic": "At-Risk: Anxiolytic",
    "at_risk_antidepressant": "At-Risk: Antidepressant",
    "at_risk_antipsychotic": "At-Risk: Antipsychotic"
}

ALL_LABEL_MAP = {
    **MH_LABELS,
    **MED_LABELS,
    **GROUPED_PIM_LABELS,
    **GROUPED_RISK_LABELS,
    **SPECIFIC_PIM_LABELS,
    **UNDER_TREAT_LABELS,
    **POLY_LABELS,
    **pim_labels,
    **risk_labels
}
