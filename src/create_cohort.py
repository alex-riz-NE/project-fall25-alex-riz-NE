import numpy
import sql_helper
import pandas as pd
from pathlib import Path

def create_stroke_aphasia_table(intermediate_table, final_table, conn, view=False):
    cursor = conn.cursor()

    cursor.execute(f"DROP TABLE IF EXISTS {final_table};")

    conn.commit()

    inpatient_stroke_query = f"""select co.condition_occurrence_id, co.person_id, co.condition_concept_id, co.condition_start_date, co.condition_end_date
    into {intermediate_table}
    from omop_cdm_53_pmtx_202203.condition_occurrence co
    inner join omop_cdm_53_pmtx_202203.visit_occurrence vo 
    on co.visit_occurrence_id = vo.visit_occurrence_id
    where vo.visit_concept_id IN 
    (
    select ca.descendant_concept_id from omop_cdm_53_pmtx_202203.concept_ancestor ca 
    inner join omop_cdm_53_pmtx_202203.concept c on 
    ca.descendant_concept_id = c.concept_id 
    where ancestor_concept_id IN (9201, 9203, 262)
    )
    and co.condition_concept_id in 
    (
    select ca.descendant_concept_id from omop_cdm_53_pmtx_202203.concept_ancestor ca 
    inner join omop_cdm_53_pmtx_202203.concept c on 
    ca.descendant_concept_id = c.concept_id 
    where ancestor_concept_id IN (372924,375557,376713,443454,441874,439847,432923)
    ); """
  # # Create a Cursor object
    cursor = conn.cursor()

    if sql_helper.check_table_exsist(intermediate_table,conn):
        print(f"Table {intermediate_table} already exists — skipping creation.")
    else:
        print(f"Table {intermediate_table} does not exist — creating it now.")
        cursor.execute(inpatient_stroke_query)
        conn.commit()
        print("The inpatient_stroke table has been created successfully!")


    print("The inpatient_stroke has been made!")

    create_cohort_w_aphasia_query = f"""
    WITH
    -- First stroke per patient
    first_stroke_occurrence AS (
        SELECT
            condition_occurrence_id,
            person_id,
            condition_concept_id,
            condition_start_date,
            condition_end_date,
            ROW_NUMBER() OVER (PARTITION BY person_id ORDER BY condition_start_date ASC) AS row_num
        FROM {intermediate_table}
    ),

    --Distinct strokes
    distinct_stroke_occurrence AS (
        SELECT
            condition_occurrence_id,
            person_id,
            condition_concept_id,
            condition_start_date,
            condition_end_date,
            DENSE_RANK() OVER (PARTITION BY person_id ORDER BY condition_start_date ASC) AS distinct_rank
        FROM first_stroke_occurrence
    ),

    --Patients with multiple strokes within 180 days
    multiple_stroke_occurrence AS (
        SELECT f1.person_id
        FROM distinct_stroke_occurrence f1
        JOIN distinct_stroke_occurrence f2
        ON f1.person_id = f2.person_id
        AND f1.distinct_rank = 1
        AND f2.distinct_rank = 2
        WHERE DATEDIFF(day, f1.condition_start_date, f2.condition_start_date) <= 180
        GROUP BY f1.person_id
    ),

    --  Define stroke cohort
    stroke_cohort AS (
        SELECT
            f.*,
            op.observation_period_start_date,
            op.observation_period_end_date,
            op.observation_period_id
        FROM first_stroke_occurrence f
        INNER JOIN omop_cdm_53_pmtx_202203.observation_period op
            ON op.person_id = f.person_id
        WHERE f.person_id IN (SELECT person_id FROM multiple_stroke_occurrence)
        AND f.row_num = 1
        AND f.condition_start_date >= DATEADD(day, 180, op.observation_period_start_date)
        AND op.observation_period_end_date >= DATEADD(day, 180, f.condition_start_date)
    ),

    -- Aphasia events
    aphasia_occurrence AS (
        SELECT
            condition_occurrence_id,
            person_id,
            condition_start_date,
            DENSE_RANK() OVER (PARTITION BY person_id ORDER BY condition_start_date ASC) AS aphasia_rank
        FROM omop_cdm_53_pmtx_202203.condition_occurrence
        WHERE condition_concept_id IN (440424, 40480002)
    ),

    valid_aphasia_occurrence AS (
        SELECT DISTINCT ao.person_id
        FROM stroke_cohort sc
        JOIN aphasia_occurrence ao
        ON sc.person_id = ao.person_id
        AND ao.condition_start_date >= sc.condition_start_date
    ),

    multiple_aphasia_occurrence AS (
        SELECT f1.person_id
        FROM aphasia_occurrence f1
        JOIN aphasia_occurrence f2
        ON f1.person_id = f2.person_id
        AND f1.aphasia_rank = 1
        AND f2.aphasia_rank = 2
        GROUP BY f1.person_id
    ),

    aphasia_indicator AS (
        SELECT
            sc.person_id,
            CASE WHEN va.person_id IS NOT NULL AND ma.person_id IS NOT NULL THEN 1 ELSE 0 END AS has_aphasia
        FROM stroke_cohort sc
        LEFT JOIN valid_aphasia_occurrence va ON sc.person_id = va.person_id
        LEFT JOIN multiple_aphasia_occurrence ma ON sc.person_id = ma.person_id
    ),
    -- Dementia events
     dementia_concept_id AS 
    (
    select ca.descendant_concept_id as concept_id 
    from omop_cdm_53_pmtx_202203.concept_ancestor ca 
    inner join omop_cdm_53_pmtx_202203.concept c on 
    ca.descendant_concept_id = c.concept_id 
    where ancestor_concept_id IN (4182210)
    ),
   
    dementia_occurrence AS (
        SELECT
            condition_occurrence_id,
            person_id,
            condition_start_date,
            DENSE_RANK() OVER (PARTITION BY person_id ORDER BY condition_start_date ASC) AS dementia_rank
        FROM omop_cdm_53_pmtx_202203.condition_occurrence
        WHERE condition_concept_id IN (SELECT concept_id FROM dementia_concept_id )
    ),

    valid_dementia_occurrence AS (
        SELECT DISTINCT dm.person_id
        FROM stroke_cohort sc
        JOIN dementia_occurrence dm
        ON sc.person_id = dm.person_id
        AND dm.condition_start_date BETWEEN
            DATEADD(day, -180, sc.condition_start_date)
            AND DATEADD(day, 180, sc.condition_start_date)
    ),

    multiple_dementia_occurrence AS (
        SELECT f1.person_id
        FROM dementia_occurrence f1
        JOIN dementia_occurrence f2
        ON f1.person_id = f2.person_id
        AND f1.dementia_rank = 1
        AND f2.dementia_rank = 2
        GROUP BY f1.person_id
    ),

    dementia_indicator AS (
        SELECT
            sc.person_id,
            CASE WHEN vd.person_id IS NOT NULL AND md.person_id IS NOT NULL THEN 1 ELSE 0 END AS has_dementia
        FROM stroke_cohort sc
        LEFT JOIN valid_dementia_occurrence vd ON sc.person_id = vd.person_id
        LEFT JOIN multiple_dementia_occurrence md ON sc.person_id = md.person_id
    )

    -- Final output
    SELECT
        sc.*,
        ai.has_aphasia,
        di.has_dementia
    INTO {final_table}
    FROM stroke_cohort sc
    LEFT JOIN aphasia_indicator ai ON sc.person_id = ai.person_id
    LEFT JOIN dementia_indicator di ON sc.person_id = di.person_id;
    """

    cursor.execute(create_cohort_w_aphasia_query)
    conn.commit()

    cursor.execute(f"select * from {final_table} limit 5")
    conn.commit()
    if view:
        df = cursor.fetch_dataframe()
        print(df)
    




if __name__ == "__main__":
    in_patient_stroke_table = "work_rizvanov_a263.inpatient_stroke_test"
    cohort_table = "work_rizvanov_a263.stroke_cohort_dementia_and_aphasia_test"

    conn = sql_helper.connect_server()
    conn.rollback()
    create_stroke_aphasia_table(in_patient_stroke_table,cohort_table, conn, view=True)
    conn.close()
  