# Exploratory Data Analysis (EDA)

This page provides a high-level overview of the study cohort, including the dementia filter, aphasia split, and overall flag distributions. The purpose is to understand the characteristics of the stroke cohort *before* evaluating PIMs, polypharmacy, or readmission risk.

---

## **Cohort Overview**

### **Dementia Filter Summary**
| Metric | Value |
|-------|-------|
| Initial cohort size | **67,128** |
| Dementia removed | **10,947 (16.31%)** |
| Final cohort (no dementia) | **56,181** |

---

### **Aphasia Split (After Dementia Filter)**
| Group | Count | Percent |
|-------|-------|---------|
| Total | **56,181** | 100% |
| Aphasia | **9,108** | 16.21% |
| No Aphasia | **47,073** | 83.79% |

---

## **Flag Prevalence (All Patients)**

Below is a summary of all medication-related and condition flags, including mental-health conditions, PIM categories, at-risk medication categories, and polypharmacy markers.

> **Note:** Only the first few rows are shown here. The full table is available in the “Flag Visualizations” page.

| Flag | Count | Percent |
|------|--------|----------|
| AD w/o Anxiety | 6748 | 12.01% |
| AD w/o Depression | 5431 | 9.67% |
| AD w/o PTSD | 11977 | 21.32% |
| AP w/o Bipolar | 1308 | 2.33% |
| AP w/o Psychosis | 1509 | 2.69% |
| *… (full table on next page)* |

---

## **Mental Health Conditions (Aphasia vs No Aphasia)**

| Condition | % All | % Aphasia | % No Aphasia | Δ (Aph – No) |
|-----------|-------|-------------|---------------|--------------|
| Depression | 24.64% | 28.11% | 23.97% | **+4.14%** |
| Anxiety | 23.09% | 23.99% | 22.92% | +1.07% |
| Seizure/Epilepsy | 11.01% | 15.57% | 10.12% | **+5.44%** |
| Psychosis | 1.92% | 1.89% | 1.93% | −0.04% |
| Bipolar Disorder | 1.77% | 1.68% | 1.78% | −0.10% |
| PTSD | 0.98% | 0.82% | 1.02% | −0.19% |
| Schizophrenia | 0.59% | 0.52% | 0.61% | −0.09% |

---

## **Medication Class Use (Aphasia vs No Aphasia)**

| Medication | % All | % Aphasia | % No Aphasia | Δ |
|-----------|--------|-----------|---------------|------|
| Antidepressant | 21.87% | 24.13% | 21.43% | +2.70% |
| Anxiolytic | 6.27% | 6.35% | 6.26% | +0.09% |
| Antipsychotic | 3.05% | 2.94% | 3.07% | −0.12% |
| Sedative/Hypnotic | 2.43% | 2.26% | 2.47% | −0.21% |

---

## **Key Takeaways**

- The aphasia subgroup has higher rates of depression, anxiety, and seizure disorders, all of which are clinically relevant to medication safety.
- Medication usage is modestly higher for antidepressants and anxiolytics in the aphasia group.
- These patterns justify further analysis of how these medications relate to PIMs and readmission risk.

---
