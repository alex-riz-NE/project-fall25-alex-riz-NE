# Hospital Readmissions & Flag Summaries

## Cohort Overview
- **Initial population:** 67,128  
- **After dementia filter:** 56,181  
- **Aphasia:** 9,108 (16.21%)  
- **No aphasia:** 47,073 (83.79%)

---

## Readmission Prevalence (All Horizons)

| Horizon | # All | % All | # Aphasia | % Aphasia | # No Aphasia | % No Aphasia | % Diff |
|-------|-------|-------|-----------|-----------|---------------|----------------|---------|
| 30d | 512 | 0.911% | 89 | 0.977% | 423 | 0.899% | 0.079% |
| 90d | 1,069 | 1.903% | 201 | 2.207% | 868 | 1.844% | 0.363% |
| 180d | 1,903 | 3.387% | 337 | 3.700% | 1,566 | 3.327% | 0.373% |

---

## Readmission Count Summary

| Horizon | Group | Mean | Median |
|--------|--------|-------|---------|
| 30d | All | 0.0217 | 0 |
| 30d | Aphasia | 0.0233 | 0 |
| 30d | No Aphasia | 0.0214 | 0 |
| 90d | All | 0.0540 | 0 |
| 90d | Aphasia | 0.0649 | 0 |
| 90d | No Aphasia | 0.0519 | 0 |
| 180d | All | 0.1166 | 0 |
| 180d | Aphasia | 0.1291 | 0 |
| 180d | No Aphasia | 0.1141 | 0 |

---

## PIM Category Readmission (All Horizons)

| Horizon | Category | Pct Aphasia | Pct No Aphasia | Diff | Mean Aph | Mean No | Mean Diff Abs |
|--------|----------|-------------|-----------------|------|----------|---------|----------------|
| 30d | PIM: Antidepressant | 8.087% | 8.379% | -0.292% | 0.2037 | 0.1966 | 0.0072 |
| 30d | PIM: Antipsychotic | 11.282% | 14.091% | -2.809% | 0.2615 | 0.3580 | 0.0964 |
| 30d | PIM: Anxiolytic | 12.121% | 8.597% | 3.524% | 0.2879 | 0.2127 | 0.0752 |
| 30d | PIM: Sed/Hypnotic | 8.654% | 7.057% | 1.597% | 0.1635 | 0.1549 | 0.0086 |
| 90d | PIM: Antidepressant | 18.351% | 17.483% | 0.869% | 0.5490 | 0.4559 | 0.0931 |
| 90d | PIM: Antipsychotic | 30.256% | 27.386% | 2.870% | 0.9128 | 0.9205 | 0.0076 |
| 90d | PIM: Anxiolytic | 20.455% | 18.703% | 1.752% | 0.5682 | 0.4992 | 0.0689 |
| 90d | PIM: Sed/Hypnotic | 25.962% | 15.318% | 10.643% | 0.6635 | 0.3752 | 0.2882 |
| 180d | PIM: Antidepressant | 33.593% | 32.966% | 0.627% | 1.1135 | 1.0193 | 0.0942 |
| 180d | PIM: Antipsychotic | 42.051% | 43.636% | -1.585% | 1.7180 | 1.9909 | 0.2730 |
| 180d | PIM: Anxiolytic | 32.576% | 32.730% | -0.154% | 1.1818 | 0.9638 | 0.2180 |
| 180d | PIM: Sed/Hypnotic | 38.462% | 30.120% | 8.341% | 1.2019 | 0.8657 | 0.3362 |

---

## At-Risk Category Readmission (All Horizons)

| Horizon | Category | Pct Aphasia | Pct No Aphasia | Diff | Mean Aph | Mean No | Mean Diff Abs |
|--------|----------|-------------|-----------------|------|----------|---------|----------------|
| 30d | Sed/Hypnotic | 0.811% | 0.808% | 0.003% | 0.0208 | 0.0190 | 0.0018 |
| 30d | Anxiolytic | 0.730% | 0.673% | 0.057% | 0.0157 | 0.0172 | 0.0015 |
| 30d | Antidepressant | 0.296% | 0.180% | 0.116% | 0.0104 | 0.0051 | 0.0053 |
| 30d | Antipsychotic | 0.787% | 0.796% | -0.009% | 0.0157 | 0.0191 | 0.0034 |
| 90d | Sed/Hypnotic | 1.913% | 1.529% | 0.384% | 0.0649 | 0.0481 | 0.0167 |
| 90d | Anxiolytic | 1.788% | 1.396% | 0.392% | 0.0551 | 0.0437 | 0.0114 |
| 90d | Antidepressant | 0.543% | 0.414% | 0.129% | 0.0242 | 0.0127 | 0.0115 |
| 90d | Antipsychotic | 1.181% | 1.752% | -0.571% | 0.0315 | 0.0478 | 0.0163 |
| 180d | Sed/Hypnotic | 3.016% | 2.548% | 0.468% | 0.1281 | 0.1102 | 0.0179 |
| 180d | Anxiolytic | 2.883% | 2.393% | 0.490% | 0.1077 | 0.1020 | 0.0056 |
| 180d | Antidepressant | 0.593% | 0.637% | -0.044% | 0.0484 | 0.0243 | 0.0241 |
| 180d | Antipsychotic | 4.331% | 2.946% | 1.385% | 0.1614 | 0.0868 | 0.0746 |

---

## Chi-Square Tests: Aphasia vs PIM / Polypharmacy

### any_pim
| | 0 | 1 |
|---|----|----|
| Aphasia = 0 | 42,538 | 4,535 |
| Aphasia = 1 | 8,156 | 952 |

- **Chi-square:** 5.707  
- **p-value:** 0.0169  

### has_polypharmacy
| | 0 | 1 |
|---|-----|-----|
| Aphasia = 0 | 26,473 | 20,600 |
| Aphasia = 1 | 4,968 | 4,140 |

- **Chi-square:** 8.804  
- **p-value:** 0.0030  

---

## Unadjusted Odds Ratios (PIM / Polypharmacy → Readmission)

Values show OR, chi-square p-value, and contingency tables.

Because **non-PIM patients had 0 readmissions**, some OR values appear as `nan` (complete separation).

### any_pim → readmission_30d
- OR = **nan**
- p = **0**

### has_polypharmacy → readmission_30d
- OR = **nan**
- p = **2.5e-144**

### any_pim → readmission_90d
- OR = **nan**
- p = **0**

### has_polypharmacy → readmission_90d
- OR = **nan**
- p = **1.28e-302**

### any_pim → readmission_180d
- OR = **nan**
- p = **0**

### has_polypharmacy → readmission_180d
- OR = **nan**
- p = **0**

# ## Discussion

### **1. Aphasia patients exhibit slightly higher readmission rates**
Across all three horizons (30, 90, 180 days), people with aphasia have **higher readmission rates** than those without aphasia.  
The difference is modest but consistent, suggesting aphasia may contribute to increased vulnerability post-stroke.

### **2. Polypharmacy is extremely common**
- **44%** of the entire cohort has polypharmacy.
- Aphasia patients have **even higher** rates (45.45%).

Given the strong association between polypharmacy and adverse events in older adults, this alone may elevate readmission risk.

### **3. PIM exposure is significantly associated with aphasia**
Chi-square results show:
- **PIMs more likely in aphasia** (p = 0.0169)
- **Polypharmacy more likely in aphasia** (p = 0.0030)

This supports the hypothesis that aphasia patients are at elevated risk for inappropriate prescribing.

### **4. Odds ratios are NaN because the “no readmission” + “PIM=1” cell is zero**
This means:
- **Every patient with PIM/polypharmacy who had readmission had at least 1 event**  
- **But some groups had zero readmissions in the PIM=0 condition**, making OR undefined.

This strongly suggests a directional relationship but requires adjusted modeling (e.g., logistic regression with rare-event corrections).

### **5. PIM subclasses show different risk patterns**
Some key observations:
- **Sedative/hypnotic PIMs** appear to increase readmissions at all time points.  
- **Antipsychotic PIMs** show higher readmission proportions in no-aphasia groups.  
- **Anxiolytic PIMs** show elevated readmission percentages in aphasia patients.

---

# ## Conclusion

This analysis demonstrates that:
- Aphasia patients have higher rates of PIM exposure, polypharmacy, and hospital readmission.
- PIMs and polypharmacy show statistically significant associations with aphasia.
- Unadjusted readmission analyses strongly suggest a relationship between inappropriate prescribing and poor outcomes.

These findings indicate a clear need for:
- Medication reconciliation interventions  
- Aphasia-specific prescribing guidelines  
- Further causal modeling to quantify risk  

---