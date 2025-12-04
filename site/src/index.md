---
title: "Examining PIMs, Polypharmacy, and Readmission Risk in Stroke Survivors with Aphasia"
toc: true
---

# Overview

This project investigates **potentially inappropriate medications (PIMs)** and **polypharmacy** among stroke survivors, with a particular focus on patients diagnosed with **aphasia**. Aphasia is frequently associated with impaired communication after stroke, which may complicate medication reconciliation, mental-health evaluation, and clinical decision-making. These challenges can contribute to inappropriate prescribing and poor care coordination.

Using OMOP-formatted clinical data, this analysis quantifies:

- The prevalence of mental-health–related PIMs  
- Polypharmacy exposure within ±180 days of stroke  
- Differences in prescribing patterns between individuals *with aphasia* and *without aphasia*  
- Whether PIMs and polypharmacy predict **30-day**, **90-day**, and **180-day** hospital readmissions  

The long-term goal is to identify medication-related risks unique to individuals with aphasia and support the creation of interventions that promote safer prescribing practices.

---

# Research Motivation

Patients with post-stroke aphasia face unique barriers:
- Communication difficulties impede reporting of symptoms or adverse drug effects  
- Mental-health conditions (depression, anxiety, PTSD) are **underdiagnosed** in aphasia populations  
- Sedatives, antipsychotics, and anticholinergic medications may **worsen cognitive or functional recovery**  
- Polypharmacy increases the cumulative risk of adverse drug events and readmission  

---

# Research Questions

## **1. Prevalence of PIMs and Polypharmacy in Aphasia**
We quantify:

- The proportion of stroke patients who receive one or more PIMs  
- Which PIM categories (antidepressants, anxiolytics, sedatives, antipsychotics) are most common  
- Differences in prevalence for patients *with aphasia* vs *without aphasia*  
- How many patients meet criteria for **polypharmacy** (e.g., ≥5 concurrent medications)

We also examine whether PIMs prescribed without matching mental-health conditions represent potential under- or over-treatment.

---

## **2. Do PIMs or Polypharmacy Predict Readmission?**

We evaluate whether exposure to PIMs or polypharmacy within ±180 days of stroke is associated with:

- **30-day readmission**
- **90-day readmission**
- **180-day readmission**

Both statistical tests (chi-square, odds ratios) and machine learning models (XGBoost) are used to estimate the magnitude of risk.  
A positive finding would suggest that:

> **Preventing inappropriate prescribing could help reduce readmissions among stroke survivors, especially those with aphasia.**

---

# The Data 

The OHDSI (Observational Health Data Sciences and Informatics) dataset is a large-scale healthcare database that is standardized using the OMOP Common Data Model (CDM). It contains de-identified electronic health records and other clinical data for millions of patients. The dataset includes detailed information on patient demographics, diagnoses, procedures and medications over a 5 year period. At Northeastern, the OHDSI Lab provides access to the Pharmetrics+ claims database, which covers approximately 31 million patient lives over a five-year period, including millions of individuals with at least one year of continuous observation. This makes it a powerful resource for population level studies on medication safety, disease progression, and healthcare delivery.

---

# The Cohort

The cohort represents a  population of 67,128 patients hospitalized with stroke, identified from the OHDSI  medical claims database using standardized OMOP criteria. To focus on cognitive and behavioral outcomes not confounded by preexisting neurodegenerative conditions, patients with documented dementia before their stroke event were removed. This resulted in a refined cohort of 56,181 individuals. Within this final group, 9,108 patients exhibited aphasia at or shortly after their stroke, while 47,073 patients did not. Aphasia often reflects greater neurological injury and can influence communication with clinicians, medication management, and post-discharge support, all of which may affect safety outcomes such as potentially inappropriate medication (PIM) use, polypharmacy, and hospital readmissions.

The cohort spans a broad range of psychiatric and neurological comorbidities, including depression, anxiety, seizure disorders, psychosis, bipolar disorder, ptsd, and schizophrenia. Polypharmacy is highly prevalent in the population, with nearly half of all stroke patients meeting the threshold of taking five or more concurrent medications. By examining how these clinical and pharmacologic patterns differ between aphasia and non-aphasia groups, the cohort enables investigation of disparities in prescribing quality, under-treatment or over-treatment patterns, and downstream risks such as readmissions across multiple time horizons (30-, 90-, and 180-day windows).

# Time line used to for classification

![alt text](Timeline-1.png)

The timeline used begins with a six-month lookback period before the index stroke event. During this window, patients are evaluated to confirm that they had no prior stroke diagnoses and to document any mental health conditions present before the cerebrovascular event. The stroke date then serves as the anchor point for all subsequent analyses. After the stroke, the timeline identifies when a patient receives a new potentially inappropriate medication. This post-stroke PIM exposure marks the start of the risk interval. From that point forward, patients are followed for six months to count emergency department visits or other readmission outcomes. This structured timeline ensures that mental health history is captured before stroke, PIM exposure is identified after stroke, and readmissions are measured prospectively, allowing for a clean temporal separation between baseline characteristics, treatment factors, and outcome assessment.


# How are PIMS classified in this project


![Pim Description](PIM_Description-1.png)

A PIM is defined as a patient who was perscribed a medication while not having the correlated mental health diagnosis. The medication classes of intrest are bolded while the mental health diagnosis classes are not. If a mental health diagnosis class is inside of the box of a medication class then that is determined to be an appropriate medication. When the boxes overlap, any of the overlapping boxes could be considered an appropriate medication. Any medication perscribed that does not have one or more mental health diagnosis inside of the box are considered potentially inapropriate medication. 


# Data Pipeline

This project constructs a reproducible data pipeline using SQL, Python, and the OMOP CDM. Key components:

1. **Cohort construction**  
   Identify stroke survivors, track stroke index dates, and capture condition and medication histories.

2. **PIM and polypharmacy flag generation**  
   Create binary indicators for PIM categories, under-treatment, and concurrent medication counts.

3. **Readmission calculations**  
   Using ED visit data, compute **30-day**, **90-day**, and **180-day** readmission windows.

4. **Statistical and ML analysis**  
   - Chi-square tests for association  
   - Odds ratios for effect size  
   - XGBoost model to predict readmission  
   - SHAP analysis to identify the strongest predictors  

---




 

