# Capstone Project Fall 2025
# Final Report

## OHDSI STROKE: 
### Dive into the relationship between stroke and aphasia survivors, mental health conditons, potentially inapproriate medicine and polypharmacy
#### Team Lead: Alex Rizvanov     &emsp; &emsp; &emsp; &emsp;  Other team members: Thang Nguyen

#### V1 Report can be found [here](https://github.com/alex-riz-NE/project-fall25-alex-riz-NE/blob/main/V1_Report.md)

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

## Structure of the project
[Project Overview](https://github.com/alex-riz-NE/project-fall25-alex-riz-NE/blob/main/site/src/index.md)

[EDA](https://github.com/alex-riz-NE/project-fall25-alex-riz-NE/blob/main/site/src/eda.md)

[Full Cohort Summary](https://github.com/alex-riz-NE/project-fall25-alex-riz-NE/blob/main/site/src/full_cohort_summary.md)

[Prediction Model](https://github.com/alex-riz-NE/project-fall25-alex-riz-NE/blob/main/site/src/readmission.md)
