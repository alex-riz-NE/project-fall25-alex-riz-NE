# OHDSI STROKE


## Team members

Alex Rizvanov and Thang Nguyen

## Project description

+ Stakeholder

Rob Cavanaugh, PhD, Asst. Prof., MGH Institute of Health Professions, Affiliate Faculty, The Roux Institute, rcavanaugh1@mghihp.edu


+ Story

Every 40 seconds, someone in the United States has a stroke, with 1 in 6 resulting in death and 800,000 new strokes every year. Stroke-related costs (e.g., cost of healthcare services, missed work, disability) in the US exceed 55 billion dollars every year, and stroke is the leading cause of long-term disability. Among stroke survivors, approximately 25-40% develop aphasia, language impairments that affect the ability to speak, understand, read, and write, creating additional barriers to healthcare communication and quality of life.
        

Stroke survivors receive complex medical care involving multiple specialties and medications throughout their recovery. However, this complexity increases the risk of potentially inappropriate medications (PIMs) and polypharmacy (use of excessive, multiple medications simultaneously). There is growing evidence that PIMs and polypharmacy negatively impact stroke recovery outcomes, and these medication-related problems appear to be more common in individuals with cognitive impairments. The prevalence of PIMS and polypharmacy may be amplified in stroke survivors with aphasia due to known underdiagnosis of mental health conditions In stroke survivors with aphasia, and well-established communication barriers between individuals with aphasia and healthcare providers.
        
The goals of this project are twofold:
            

+ Examine the prevalence of potentially inappropriate medications and polypharmacy in stroke survivors with aphasia. This goal could be achieved by identifying and quantifying PIMs related to mental health conditions and stroke recovery, comparing medication patterns between stroke survivors with and without aphasia, and/or using machine learning approaches to identify subgroups at highest risk for inappropriate prescribing. I am particularly interested in examining medications that may inhibit stroke recovery (such as certain sedatives, anticholinergics, and antipsychotics) as well as PIMs related to mental health conditions that are often underdiagnosed in aphasia populations.
            

+ Evaluate whether the presence of PIMs or polypharmacy predicts 30- or 90-day readmissions after stroke. A finding that PIMS and polypharmacy are more prevalent in stroke survivors with aphasia and are related to re-admission rates would indicate the need to develop specific interventions to prevent prescription of PIMS and polypharmacy in this population.


## Goal

The process of dealing with strokes is a very challenging one with many difference personal and medications. The combinations of these can lead to potentially inappropriate medications (PIMs) and polypharmacy (use of excessive, multiple medications simultaneously). Our project aims to identify and quantify PIM and polypharmacy in the aphasia stroke cohort. In doing this, an explanitory model can be made to identify at risk patients groups or classifying potential avenues for more stringent medical practice. 


## Data

OHDSI- OHDSI Lab Pharmetrics+ data https://ohdsi.northeastern.edu/

## Proposal V2
In V1, we were able to discover the cohort of patients with PIMS and interesting result from EDA.

For V2, our goals for the project are still the same.

### Some changes in V2
After meeting with our stakeholder Rob and Chelsea on Monday 10/27, we made some changes to our cohort:

+ Exclude patients with dementia
+ Flag delirium diagnoses
+ Flag insomnia diagnoses
+ Use the lookback period for stroke to identify the mental health conditions, but also include the post-stroke period
+ Start a 6-month lookforward period for ED visits. PIMS are associated with higher rates of ED visits
+ Look at depression coding with and without aphasia

Some changes also made to how to view medications data:
+ Only include PO medications (No IV meds)
+ Exclude hypnotic sedatives; only focus on anxiety and depression
