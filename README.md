# Capstone Project Fall 2025
# Final Report

## OHDSI STROKE: 
### Dive into the relationship between stroke and aphasia survivors, mental health conditons, potentially inapproriate medicine and polypharmacy
#### Team Lead: Alex Rizvanov     &emsp; &emsp; &emsp; &emsp;  Other team members: Thang Nguyen

#### V1 Report can be found [here](https://github.com/alex-riz-NE/project-fall25-alex-riz-NE/blob/main/V1_Report.md)
#### Presentation can be found [here](https://github.com/alex-riz-NE/project-fall25-alex-riz-NE/blob/main/docs/OHDSI%20STROKE%V2.pptx)
# Story

A stroke is one of the most serious and costly health events in the United States, occurring every 40 seconds and often leading to long-term disability that affects both quality of life and independence. Among stroke survivors, up to 40 percent develop aphasia, a language impairment that makes it difficult to speak, understand, read, or write, creating significant communication barriers with healthcare providers. These individuals typically undergo complex medical care involving multiple providers and medications, which increases the risk of polypharmacy and exposure to potentially inappropriate medications (PIMs), such as sedatives, anticholinergics, and antipsychotics that may negatively impact stroke recovery and cognitive function. Because mental health conditions are frequently underdiagnosed in patients with aphasia, inappropriate prescribing may be even more prevalent in this population. This project aims to examine whether stroke survivors with aphasia experience higher rates of PIMs and polypharmacy compared to those without aphasia, and to investigate whether these medication patterns are associated with increased 30- or 90-day hospital readmissions, highlighting the need for safer and more targeted prescribing practices for this vulnerable group.

# Stakeholder

Rob Cavanaugh, PhD, CCC-SLP, is an Assistant Professor at the Massachusetts General Hospital Institute for Health Professions and affiliate faculty at the Roux Institute.


# Instruction on how to reimplement the project
First, user needs to obtain credentials through OHDSI lab and then modify the config file with your credentials to access the database and recreate the results.

Run the below code to create essential tables and cohort

```makefile
make cohort
```

To see flags for all conditions, run
```makefile
make conditon_flags
make polypharmacy_flags
```

To see Asphasia-PIM analysis result, run
```makefile
make analysis
```

To look into hospital readmission, run
```makefile
make readmission
```

To see model, run
```makefile
make model
```

# Result

### Hospital Readmission

![Hospital Readmission](https://github.com/alex-riz-NE/project-fall25-alex-riz-NE/blob/main/fig/hospital_eda/hospital_readmissions_by_aphasia.png)

Stroke survivors with aphasia have a visually higher rate of hospital readmission compared to those without aphasia.
### Aphasia-PIM Analysis Summary

![Aphasia-PIM Analysis Summary](https://github.com/alex-riz-NE/project-fall25-alex-riz-NE/blob/main/fig/latex/stroke_capstone_1.png)

The total cohort after the dementia filter is 56,181 stroke survivors. Depression with Antidepressant (AP) use is the most prevalent flag involving a specific PIM class suggesting a high rate of antidepressant prescribing in the stroke survivor population.


![All Flag Counts](https://github.com/alex-riz-NE/project-fall25-alex-riz-NE/blob/main/fig/latex/stroke_capstone_2.png)

Aphasia patients are substantially more likely to receive medications that are not PIMs by definition but are risky in the context of stroke recovery:

+ Sedatives/hypnotics: 33.86% vs 29.18%

+ Anxiolytics: 30.08% vs 25.57%


![](https://github.com/alex-riz-NE/project-fall25-alex-riz-NE/blob/main/fig/latex/stroke_capstone_3.png)

For Antipsychotic PIMs and Anticholinergic PIMs, the Aphasia cohort consistently demonstrates a higher Odds Ratio compared to the No Aphasia cohort, suggesting that PIM use in individuals with aphasia may confer an even greater risk of readmission.

![](https://github.com/alex-riz-NE/project-fall25-alex-riz-NE/blob/main/fig/latex/stroke_capstone_4.png)

The aphasia cohort consistently shows a higher prevalence of polypharmacy and risk for specific inappropriate medications compared to the no-aphasia cohort across nearly all categories. 


![](https://github.com/alex-riz-NE/project-fall25-alex-riz-NE/blob/main/fig/latex/stroke_capstone_5.png)

Aphasia patients with polypharmacy are more likely to have PIMs involving antidepressants and sedatives/hypnotics but also are less likely to have antipsychotic PIMs. 

### Model

![XGB Feature Importance 180 days](https://github.com/alex-riz-NE/project-fall25-alex-riz-NE/blob/main/fig/xgb/xgb_feature_importance_180d.png)

![SHAP Summary Plot](https://github.com/alex-riz-NE/project-fall25-alex-riz-NE/blob/main/fig/xgb/shap_summary_plot.png)

![False Positive SHAP Summary Plot](https://github.com/alex-riz-NE/project-fall25-alex-riz-NE/blob/main/fig/xgb/false_positive_shap_summary_plot.png)

![Precision Recall Curve 180days](https://github.com/alex-riz-NE/project-fall25-alex-riz-NE/blob/main/fig/xgb/precision_recall_curve_180d.png)

The model identify inappropriate and complex prescribing as the most actionable target for intervention to reduce hospital readmission rates in stroke survivors, with aphasia being a critical co-factor that increases the overall risk








