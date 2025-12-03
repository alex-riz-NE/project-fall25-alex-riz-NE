library(ohdsilab)
library(tidyverse)
library(DatabaseConnector)
library(keyring)

cdm_schema <- "omop_cdm_53_pmtx_202203"
write_schema <- paste0("work_", keyring::key_get("db_username"))

con <- DatabaseConnector::connect(
  dbms = "redshift",
  server = "ohdsi-lab-redshift-cluster-prod.clsyktjhufn7.us-east-1.redshift.amazonaws.com/ohdsi_lab",
  pathToDriver = 'D:/Users/nguyen.thang4', # Change path here
  port = 5439,
  user = keyring::key_get("db_username"),
  password = keyring::key_get("db_password")
)

# Test if the connection works
if (isTRUE(DatabaseConnector::dbIsValid(con))) print("Connected Successfully")

# make it easier for some r functions to find the database
options(con.default.value = con)
options(schema.default.value = cdm_schema)
options(write_schema.default.value = write_schema)

#########################################################
sql <- "
SELECT 
    de.drug_concept_id,
    c.concept_name AS drug_name,
    COUNT(DISTINCT de.person_id) AS n_patients
FROM omop_cdm_53_pmtx_202203.drug_exposure de
LEFT JOIN omop_cdm_53_pmtx_202203.concept c
  ON de.drug_concept_id = c.concept_id
WHERE de.drug_concept_id <> 0
GROUP BY de.drug_concept_id, c.concept_name
ORDER BY n_patients DESC
LIMIT 10;
"
df_drugs <- dbGetQuery(con, sql)
df_drugs$n_patients <- as.numeric(df_drugs$n_patients)
df_drugs <- df_drugs[order(df_drugs$n_patients), ]

short_names <- c(
  "Influenza, injectable, quadrivalent, preservative free" = "Influenza vaccine",
  "{6 (azithromycin 250 MG Oral Tablet) } Pack" = "Azithromycin 250 MG",
  "tetanus toxoid, reduced diphtheria toxoid, and acellular pertussis vaccine, adsorbed" = "Tdap Vaccine",
  "amoxicillin 875 MG / clavulanate 125 MG Oral Tablet" = "Amoxicillin 875 MG/Clavulanate 125 MG",
  "amoxicillin 500 MG Oral Capsule" = "amoxicillin 500 MG Oral Capsule",
  "acetaminophen 325 MG / hydrocodone bitartrate 5 MG Oral Tablet" = "Acetaminophen 325 MG/Hydrocodone bitartrate 5 MG",
  "ondansetron Injection" = "ondansetron Injection",
  "dexamethasone 1 MG" = "dexamethasone 1 MG",
  "prednisone 20 MG Oral Tablet" = "prednisone 20 MG Oral Tablet",
  "SARS-CoV-2 (COVID-19) vaccine, mRNA-BNT162b2 0.1 MG/ML Injectable Suspension" = "SARS-CoV-2 (COVID-19) vaccine"
)
df_drugs$drug_name_short <- short_names[df_drugs$drug_name]

# Create 'fig' directory
if (!dir.exists("project-alex-riz-NE/fig")) dir.create("project-alex-riz-NE/fig")

# Plot 1: Top Drugs Taken by Patients
jpeg("project-alex-riz-NE/fig/eda1.jpeg", width = 800, height = 600)
par(mar = c(5, 18, 4, 2))  # bottom, left, top, right
barplot(
  df_drugs$n_patients,
  names.arg = df_drugs$drug_name_short,
  las = 1,
  col = "steelblue",
  horiz = TRUE,
  main = "Top Drugs Taken by Patients",
  xlab = "Number of Patients",
  cex.names = 0.8
)
dev.off()

#########################################################
df <- tbl(con, inDatabaseSchema(cdm_schema, "condition_occurrence")) |>
  inner_join(
    tbl(con, inDatabaseSchema(cdm_schema, "person")),
    by = "person_id"
  ) |>
  head(25) |>     # limit rows on the DB side
  collect()

# Plot 2: Conditions by Gender
df_summary <- df |>
  group_by(gender_concept_id) |>
  tally()

p <- ggplot(df_summary, aes(x = factor(gender_concept_id), y = n, fill = factor(gender_concept_id))) +
  geom_col() +
  labs(title = "Conditions by Gender",
       x = "Gender Concept ID", y = "Number of Conditions") +
  theme_minimal()

ggsave("project-alex-riz-NE/fig/eda2.jpeg", p, width = 8, height = 6)

# Close database connection ---
DatabaseConnector::disconnect(con)
