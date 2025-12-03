# Capstone Project Fall 2025

## OHDSI STROKE: 
### Dive into the relationship between stroke and aphasia survivors, mental health conditons, potentially inapproriate medicine and polypharmacy
#### Team Lead: Alex Rizvanov     &emsp; &emsp; &emsp; &emsp;  Other team members: Thang Nguyen


# Story

A stroke is one of the most serious and costly health events in the United States, occurring every 40 seconds and often leading to long-term disability that affects both quality of life and independence. Among stroke survivors, up to 40 percent develop aphasia, a language impairment that makes it difficult to speak, understand, read, or write, creating significant communication barriers with healthcare providers. These individuals typically undergo complex medical care involving multiple providers and medications, which increases the risk of polypharmacy and exposure to potentially inappropriate medications (PIMs), such as sedatives, anticholinergics, and antipsychotics that may negatively impact stroke recovery and cognitive function. Because mental health conditions are frequently underdiagnosed in patients with aphasia, inappropriate prescribing may be even more prevalent in this population. This project aims to examine whether stroke survivors with aphasia experience higher rates of PIMs and polypharmacy compared to those without aphasia, and to investigate whether these medication patterns are associated with increased 30- or 90-day hospital readmissions, highlighting the need for safer and more targeted prescribing practices for this vulnerable group.

# The Data 

The OHDSI (Observational Health Data Sciences and Informatics) dataset is a large-scale healthcare database that is standardized using the OMOP Common Data Model (CDM). It contains de-identified electronic health records and other clinical data for millions of patients. The dataset includes detailed information on patient demographics, diagnoses, procedures and medications over a 5 year period. At Northeastern, the OHDSI Lab provides access to the Pharmetrics+ claims database, which covers approximately 31 million patient lives over a five-year period, including millions of individuals with at least one year of continuous observation. This makes it a powerful resource for population level studies on medication safety, disease progression, and healthcare delivery.

# Reproduction of Casey Tilden's cohort and EDA

The first part of our project was to reproduce Casey's work , which can be seen at this [link](https://github.com/ds5500/project-cbt87/tree/main) with right permissions. His project was to replicate a study that analyzes guideline adherence in the treatment of speach conditions after stroke. In order to do this, he first had to create a cohort, which is a group of people who share a common characteristic or expierience which is studied over time. Using his cohort we were able to reproduce his EDA. 



# Instructions on gaining access to the data

To actually run the code you must first gain OHDSI clearance which only comes after completeing [CITI](https://about.citiprogram.org) training. Once this is complete you will gain access to OHDSI credentials which you can use to create your own config file as well as your own stroke table and cohort table which you would change at the bottom.

Furthermore, there is more data needed for the project. The condition_ids for the required conditons are found by running:

```makefile
make conditon_data
``` 
Attention: There are plans in motion to create randomize and scrambled data so that the code can run without access to OHDSI.  


# Instructions to create cohort

This is basically code is basically Casey's with a little editing for modularization and testing. 

In order to create the cohort run:

```makefile
make cohort
``` 

# EDA

## Instructions to create EDA figures


In order to recreate the figures made in the EDA run:
```makefile
make cohort
```

The risk of stroke increases as the populations ages, but there is clearly an outlier around the year 1937 when looking at the chart below. This is due to the fact that there are not enough of a population born before that year to hide the identity of the individuals to the standard that OHDSI holds. This leads to there not being a good way to dig insights based on granular age since there is a large mahority of the cohort who's age has been obfuscated. If age will be taken into consideration, then binning will be necesary. 

![Stroke Cohort by Year of Birth](https://github.com/ds5500/project-alex-riz-NE/blob/main/fig/stroke_cts_by_yob.jpg?raw=true)


When it comes to gender there is a pretty even mix of genders until age increases to some of the older patients where it started to lean heavily towards female.

![Stroke Cohort by Gender](https://github.com/ds5500/project-alex-riz-NE/blob/main/fig/stroke_ct_by_yob_gender.jpg?raw=true)


The chart below shows that there is a wealth of data from some states while there is close to none in other. This could have many explinations. Some states might have greater healthcare coverage. Also, some states might have more access to care. Furthermore, some doctors might do a better job reporting and have closer ties to OHDSI and the data collection they did. 


![Stroke Cohort by state](https://github.com/ds5500/project-alex-riz-NE/blob/main/fig/stroke_ct_by_state.jpg?raw=true)


# Creating flags for conditions

The next part of the project will involve creating flag, the flag having the value of 1 if condition is present and 0 if not. 

To create all the flags you will need for the next part run:

```makefile
make conditon_flags
make polypharmacy_flags
```

# Brief EDA into these flags
When looking at the raw data it seems like there are some conditions that are very rare for our cohort, that being bipolar, psychotic, ptsd, and schizophrenia. This makes sense since these conditions are rare in the population as well. The one shocking thing from this exploration was that there were a supprisingly high amount of the population who were flagged for polypharmacy, which is defined as having 5 or more substances in a 6 month timeframe before or after surgery. 
<p align="center">
  <img src="https://github.com/ds5500/project-alex-riz-NE/blob/main/fig/flag_eda_first_look/flag_counts_table.png" width="45%" />
  <img src="https://github.com/ds5500/project-alex-riz-NE/blob/main/fig/flag_eda_first_look/flag_counts_bar.png" width="45%" />
</p>



It is hard to compare nine different conditions to eachother. The first step to try to get a bigger picture was to create a co-occurence graph. This graph sees how many times both flags were seen in the same person. As seen from the dark blue square: depression is commonly seen with polypharmacy as well as with anxiety, with 9118 and 7483 people in common. There are also a fair amount crossover between anxiety and aphasia which is interesting. 

![lower_trianfle_co_occurence_heatmap.png](https://github.com/ds5500/project-alex-riz-NE/blob/main/fig/flag_eda_first_look/lower_trianfle_co_occurence_heatmap.png)


To go ever deep a chord graph was made. This graph is not strong at showing exact numbers, but it is strong at showing how classes are related to one another. The width of each segment, called a chord, represents strong relationships. The outer ring represents the proportion of the total as well as the start and target of each chord. It is hard to make out, but polypharmacy has chords connecting to all of the other conditions with its connection to anxiety and depression being the highest. 

![AllnChord Graph](https://github.com/ds5500/project-alex-riz-NE/blob/main/fig/flag_eda_first_look/all_conditions.png)

To go further into the effect that aphasia has on the related conditons I wanted to isolate the other conditions and make a chord chart out of tables with and without aphasia. On first glance there seems to be no difference, but on closer inspection the widths of the lines are slightly different. The grpah with aphasia appears to show that seizures have a stronger relationship to the other conditions, including polypharmacy. This makes sens due to there being more seizures with a population that has aphasia which would imply more medications. 

![Chord Graph](https://github.com/ds5500/project-alex-riz-NE/blob/main/fig/flag_eda_first_look/aphasia_v_nonahashia_chord_graph.png)



# Stakeholder

Rob Cavanaugh, PhD, CCC-SLP, is an Assistant Professor at the Massachusetts General Hospital Institute for Health Professions and affiliate faculty at the Roux Institute. Dr. Cavanaugh’s background as a speech-language pathologist in neurorehabilitation shapes both his teaching and research. His current research integrates rehabilitation health services, population health, and data science, using large-scale datasets such as insurance claims and electronic health records to study healthcare outcomes and improve care delivery. He has ongoing collaborations with researchers including Brianne Olivieri-Mui and Louisa Smith, working with real-world data sources such as the OHDSI Lab data at Northeastern University and the All of Us Research Program. He also serves as a domain expert in real-world data for data science student research projects.





