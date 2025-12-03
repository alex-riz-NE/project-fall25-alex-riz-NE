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
- Polypharmacy increases the cumulative risk of adverse drug events, falls, delirium, and readmission  

These concerns motivate the project’s central questions:

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

# Visualizations and Results

_(You can embed your charts here once generated.)_

Examples of sections you can add:

```js
// Example: import a figure
import Figure("figures/pim_prevalence.png")
