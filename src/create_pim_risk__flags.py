import sql_helper


def make_all_flags(cohort_table, final_table, conn):
    cursor = conn.cursor()
    cursor.execute(f"DROP TABLE IF EXISTS {final_table};")

    query = f"""
    CREATE TABLE {final_table} AS
    WITH
    stroke_dates AS (
        SELECT
            person_id,
            MIN(condition_start_date) AS stroke_date
        FROM {cohort_table}
        GROUP BY person_id
    ),

    drug_exposure_window AS (
        SELECT
            de.person_id,
            de.drug_concept_id,
            de.drug_exposure_start_date,
            de.days_supply
        FROM omop_cdm_53_pmtx_202203.drug_exposure de
        JOIN stroke_dates sd ON de.person_id = sd.person_id
        WHERE
            de.days_supply >= 30
            AND de.drug_exposure_start_date BETWEEN
                DATEADD(day, -180, sd.stroke_date)
                AND DATEADD(day, 180, sd.stroke_date)
    ),

    med_flags AS (
        SELECT
            de.person_id,
            MAX(CASE WHEN ml.atc_class = 'antidep'   THEN 1 ELSE 0 END) AS took_antidep,
            MAX(CASE WHEN ml.atc_class = 'anx'       THEN 1 ELSE 0 END) AS took_anxiolytic,
            MAX(CASE WHEN ml.atc_class = 'hyp_sed'   THEN 1 ELSE 0 END) AS took_hyp_sed,
            MAX(CASE WHEN ml.atc_class = 'antipsych' THEN 1 ELSE 0 END) AS took_antipsych
        FROM drug_exposure_window de
        JOIN work_rizvanov_a263.medication_list ml
          ON de.drug_concept_id = ml.concept_id
        GROUP BY de.person_id
    ),

    mh_flags AS (
        SELECT
            co.person_id,
            MAX(CASE WHEN ml.condition_group = 'anxiety'    THEN 1 ELSE 0 END) AS has_anxiety,
            MAX(CASE WHEN ml.condition_group = 'bipolar'    THEN 1 ELSE 0 END) AS has_bipolar,
            MAX(CASE WHEN ml.condition_group = 'depression' THEN 1 ELSE 0 END) AS has_depression,
            MAX(CASE WHEN ml.condition_group = 'psychosis'  THEN 1 ELSE 0 END) AS has_psychosis,
            MAX(CASE WHEN ml.condition_group = 'PTSD'       THEN 1 ELSE 0 END) AS has_ptsd,
            MAX(CASE WHEN ml.condition_group = 'schizo'     THEN 1 ELSE 0 END) AS has_schizo,
            MAX(CASE WHEN ml.condition_group = 'seizure'    THEN 1 ELSE 0 END) AS has_seizure
        FROM omop_cdm_53_pmtx_202203.condition_occurrence co
        JOIN work_rizvanov_a263.mental_health_list ml
          ON co.condition_concept_id = ml.concept_id
        JOIN stroke_dates sd
          ON co.person_id = sd.person_id
        WHERE co.condition_start_date BETWEEN
                DATEADD(day, -180, sd.stroke_date)
                AND DATEADD(day, 180, sd.stroke_date)
        GROUP BY co.person_id
    ),

    final_flags AS (
        SELECT
            sd.person_id,
            sd.stroke_date,

            -- MH flags (COALESCE so they’re always 0/1)
            COALESCE(mh.has_anxiety,    0) AS has_anxiety,
            COALESCE(mh.has_bipolar,    0) AS has_bipolar,
            COALESCE(mh.has_depression, 0) AS has_depression,
            COALESCE(mh.has_psychosis,  0) AS has_psychosis,
            COALESCE(mh.has_ptsd,       0) AS has_ptsd,
            COALESCE(mh.has_schizo,     0) AS has_schizo,
            COALESCE(mh.has_seizure,    0) AS has_seizure,

            -- Medication flags
            COALESCE(mf.took_antidep,    0) AS took_antidep,
            COALESCE(mf.took_anxiolytic, 0) AS took_anxiolytic,
            COALESCE(mf.took_hyp_sed,    0) AS took_hyp_sed,
            COALESCE(mf.took_antipsych,  0) AS took_antipsych,

            -------------------------------------------------------------------
            -- 1) GROUPED PIM FLAGS (med class prescribed, no appropriate cond)
            -------------------------------------------------------------------
            CASE WHEN COALESCE(mf.took_antidep,0) = 1 AND
                (COALESCE(mh.has_depression,0) +
                 COALESCE(mh.has_ptsd,0) +
                 COALESCE(mh.has_anxiety,0)) = 0
            THEN 1 ELSE 0 END AS antidepressant_pim,

            CASE WHEN COALESCE(mf.took_anxiolytic,0) = 1 AND
                (COALESCE(mh.has_anxiety,0) +
                 COALESCE(mh.has_ptsd,0) +
                 COALESCE(mh.has_seizure,0)) = 0
            THEN 1 ELSE 0 END AS anxiolytic_pim,

            CASE WHEN COALESCE(mf.took_hyp_sed,0) = 1 AND
                (COALESCE(mh.has_anxiety,0) +
                 COALESCE(mh.has_ptsd,0) +
                 COALESCE(mh.has_seizure,0)) = 0
            THEN 1 ELSE 0 END AS sedative_pim,

            CASE WHEN COALESCE(mf.took_antipsych,0) = 1 AND
                (COALESCE(mh.has_bipolar,0) +
                 COALESCE(mh.has_psychosis,0) +
                 COALESCE(mh.has_schizo,0)) = 0
            THEN 1 ELSE 0 END AS antipsychotic_pim,
            
          CASE WHEN
               (CASE WHEN COALESCE(mf.took_antidep,0) = 1 AND
                    (COALESCE(mh.has_depression,0) +
                    COALESCE(mh.has_ptsd,0) +
                    COALESCE(mh.has_anxiety,0)) = 0 THEN 1 ELSE 0 END) = 1
               OR
               (CASE WHEN COALESCE(mf.took_anxiolytic,0) = 1 AND
                    (COALESCE(mh.has_anxiety,0) +
                    COALESCE(mh.has_ptsd,0) +
                    COALESCE(mh.has_seizure,0)) = 0 THEN 1 ELSE 0 END) = 1
               OR
               (CASE WHEN COALESCE(mf.took_hyp_sed,0) = 1 AND
                    (COALESCE(mh.has_anxiety,0) +
                    COALESCE(mh.has_ptsd,0) +
                    COALESCE(mh.has_seizure,0)) = 0 THEN 1 ELSE 0 END) = 1
               OR
               (CASE WHEN COALESCE(mf.took_antipsych,0) = 1 AND
                    (COALESCE(mh.has_bipolar,0) +
                    COALESCE(mh.has_psychosis,0) +
                    COALESCE(mh.has_schizo,0)) = 0 THEN 1 ELSE 0 END) = 1
               THEN 1 ELSE 0 END AS any_pim,

            -------------------------------------------------------------------
            -- 2) GROUPED AT-RISK FLAGS (cond group present, med class absent)
            -------------------------------------------------------------------
            CASE WHEN
                (COALESCE(mh.has_depression,0) +
                 COALESCE(mh.has_ptsd,0) +
                 COALESCE(mh.has_anxiety,0)) > 0
                AND COALESCE(mf.took_antidep,0) = 0
            THEN 1 ELSE 0 END AS at_risk_antidepressant,

            CASE WHEN
                (COALESCE(mh.has_anxiety,0) +
                 COALESCE(mh.has_ptsd,0) +
                 COALESCE(mh.has_seizure,0)) > 0
                AND COALESCE(mf.took_anxiolytic,0) = 0
            THEN 1 ELSE 0 END AS at_risk_anxiolytic,

            CASE WHEN
                (COALESCE(mh.has_anxiety,0) +
                 COALESCE(mh.has_ptsd,0) +
                 COALESCE(mh.has_seizure,0)) > 0
                AND COALESCE(mf.took_hyp_sed,0) = 0
            THEN 1 ELSE 0 END AS at_risk_sedative,

            CASE WHEN
                (COALESCE(mh.has_bipolar,0) +
                 COALESCE(mh.has_psychosis,0) +
                 COALESCE(mh.has_schizo,0)) > 0
                AND COALESCE(mf.took_antipsych,0) = 0
            THEN 1 ELSE 0 END AS at_risk_antipsychotic,

            -------------------------------------------------------------------
            -- 3) SPECIFIC CONDITION PIM:
            --    prescribed_no_condition_* (med given, specific cond absent)
            -------------------------------------------------------------------

            -- Antidepressants
            CASE WHEN COALESCE(mf.took_antidep,0) = 1
                 AND COALESCE(mh.has_depression,0) = 0
            THEN 1 ELSE 0 END AS prescribed_no_condition_depression,

            CASE WHEN COALESCE(mf.took_antidep,0) = 1
                 AND COALESCE(mh.has_ptsd,0) = 0
            THEN 1 ELSE 0 END AS prescribed_no_condition_ptsd_ad,

            CASE WHEN COALESCE(mf.took_antidep,0) = 1
                 AND COALESCE(mh.has_anxiety,0) = 0
            THEN 1 ELSE 0 END AS prescribed_no_condition_anxiety_ad,

            -- Anxiolytics
            CASE WHEN COALESCE(mf.took_anxiolytic,0) = 1
                 AND COALESCE(mh.has_anxiety,0) = 0
            THEN 1 ELSE 0 END AS prescribed_no_condition_anxiety_ano,

            CASE WHEN COALESCE(mf.took_anxiolytic,0) = 1
                 AND COALESCE(mh.has_ptsd,0) = 0
            THEN 1 ELSE 0 END AS prescribed_no_condition_ptsd_ano,

            CASE WHEN COALESCE(mf.took_anxiolytic,0) = 1
                 AND COALESCE(mh.has_seizure,0) = 0
            THEN 1 ELSE 0 END AS prescribed_no_condition_seizure_ano,

            -- Sedatives
            CASE WHEN COALESCE(mf.took_hyp_sed,0) = 1
                 AND COALESCE(mh.has_anxiety,0) = 0
            THEN 1 ELSE 0 END AS prescribed_no_condition_anxiety_sed,

            CASE WHEN COALESCE(mf.took_hyp_sed,0) = 1
                 AND COALESCE(mh.has_ptsd,0) = 0
            THEN 1 ELSE 0 END AS prescribed_no_condition_ptsd_sed,

            CASE WHEN COALESCE(mf.took_hyp_sed,0) = 1
                 AND COALESCE(mh.has_seizure,0) = 0
            THEN 1 ELSE 0 END AS prescribed_no_condition_seizure_sed,

            -- Antipsychotics
            CASE WHEN COALESCE(mf.took_antipsych,0) = 1
                 AND COALESCE(mh.has_bipolar,0) = 0
            THEN 1 ELSE 0 END AS prescribed_no_condition_bipolar,

            CASE WHEN COALESCE(mf.took_antipsych,0) = 1
                 AND COALESCE(mh.has_psychosis,0) = 0
            THEN 1 ELSE 0 END AS prescribed_no_condition_psychosis,

            CASE WHEN COALESCE(mf.took_antipsych,0) = 1
                 AND COALESCE(mh.has_schizo,0) = 0
            THEN 1 ELSE 0 END AS prescribed_no_condition_schizo,

            -------------------------------------------------------------------
            -- 4) SPECIFIC CONDITION UNDER-TREATMENT:
            --    condition_not_prescribed_* (cond present, med absent)
            -------------------------------------------------------------------

            -- Depression → antidepressant
            CASE WHEN COALESCE(mh.has_depression,0) = 1
                 AND COALESCE(mf.took_antidep,0) = 0
            THEN 1 ELSE 0 END AS condition_not_prescribed_depression,

            -- Anxiety → anxiolytics & sedatives
            CASE WHEN COALESCE(mh.has_anxiety,0) = 1
                 AND COALESCE(mf.took_anxiolytic,0) = 0
            THEN 1 ELSE 0 END AS condition_not_prescribed_anxiety_ano,

            CASE WHEN COALESCE(mh.has_anxiety,0) = 1
                 AND COALESCE(mf.took_hyp_sed,0) = 0
            THEN 1 ELSE 0 END AS condition_not_prescribed_anxiety_sed,

            -- PTSD → anxiolytics & sedatives
            CASE WHEN COALESCE(mh.has_ptsd,0) = 1
                 AND COALESCE(mf.took_anxiolytic,0) = 0
            THEN 1 ELSE 0 END AS condition_not_prescribed_ptsd_ano,

            CASE WHEN COALESCE(mh.has_ptsd,0) = 1
                 AND COALESCE(mf.took_hyp_sed,0) = 0
            THEN 1 ELSE 0 END AS condition_not_prescribed_ptsd_sed,

            -- Seizure → anxiolytic/sedative
            CASE WHEN COALESCE(mh.has_seizure,0) = 1
                 AND COALESCE(mf.took_anxiolytic,0) = 0
            THEN 1 ELSE 0 END AS condition_not_prescribed_seizure_ano,

            CASE WHEN COALESCE(mh.has_seizure,0) = 1
                 AND COALESCE(mf.took_hyp_sed,0) = 0
            THEN 1 ELSE 0 END AS condition_not_prescribed_seizure_sed,

            -- Antipsychotic conditions → antipsychotics
            CASE WHEN COALESCE(mh.has_bipolar,0) = 1
                 AND COALESCE(mf.took_antipsych,0) = 0
            THEN 1 ELSE 0 END AS condition_not_prescribed_bipolar,

            CASE WHEN COALESCE(mh.has_psychosis,0) = 1
                 AND COALESCE(mf.took_antipsych,0) = 0
            THEN 1 ELSE 0 END AS condition_not_prescribed_psychosis,

            CASE WHEN COALESCE(mh.has_schizo,0) = 1
                 AND COALESCE(mf.took_antipsych,0) = 0
            THEN 1 ELSE 0 END AS condition_not_prescribed_schizo
        FROM stroke_dates sd
        LEFT JOIN mh_flags mh ON sd.person_id = mh.person_id
        LEFT JOIN med_flags mf ON sd.person_id = mf.person_id
    )

    SELECT
        sc.*,

        -- index stroke date from flags table (alias to avoid future collisions)
        ff.stroke_date AS index_stroke_date,

        -- MH flags
        ff.has_anxiety,
        ff.has_bipolar,
        ff.has_depression,
        ff.has_psychosis,
        ff.has_ptsd,
        ff.has_schizo,
        ff.has_seizure,

        -- medication flags
        ff.took_antidep,
        ff.took_anxiolytic,
        ff.took_hyp_sed,
        ff.took_antipsych,

        -- grouped PIM / at-risk
        ff.antidepressant_pim,
        ff.anxiolytic_pim,
        ff.sedative_pim,
        ff.antipsychotic_pim,
        ff.any_pim,

        ff.at_risk_antidepressant,
        ff.at_risk_anxiolytic,
        ff.at_risk_sedative,
        ff.at_risk_antipsychotic,

        -- specific PIM: prescribed_no_condition_*
        ff.prescribed_no_condition_depression,
        ff.prescribed_no_condition_ptsd_ad,
        ff.prescribed_no_condition_anxiety_ad,
        ff.prescribed_no_condition_anxiety_ano,
        ff.prescribed_no_condition_ptsd_ano,
        ff.prescribed_no_condition_seizure_ano,
        ff.prescribed_no_condition_anxiety_sed,
        ff.prescribed_no_condition_ptsd_sed,
        ff.prescribed_no_condition_seizure_sed,
        ff.prescribed_no_condition_bipolar,
        ff.prescribed_no_condition_psychosis,
        ff.prescribed_no_condition_schizo,

        -- specific under-treatment: condition_not_prescribed_*
        ff.condition_not_prescribed_depression,
        ff.condition_not_prescribed_anxiety_ano,
        ff.condition_not_prescribed_anxiety_sed,
        ff.condition_not_prescribed_ptsd_ano,
        ff.condition_not_prescribed_ptsd_sed,
        ff.condition_not_prescribed_seizure_ano,
        ff.condition_not_prescribed_seizure_sed,
        ff.condition_not_prescribed_bipolar,
        ff.condition_not_prescribed_psychosis,
        ff.condition_not_prescribed_schizo

    FROM {cohort_table} sc
    LEFT JOIN final_flags ff ON sc.person_id = ff.person_id;
    """

    cursor.execute(query)
    conn.commit()
    print(f"✅ Created {final_table} with all PIM / at-risk / specific flags.")
    cursor.close()


if __name__ == "__main__":
    cohort_table = "work_rizvanov_a263.stroke_cohort_dementia_and_aphasia_test"
    final_table  = "work_rizvanov_a263.stroke_cohort_w_all_flags"
    conn = sql_helper.connect_server()
    print("Connected successfully!")
    conn.rollback()
    make_all_flags(cohort_table, final_table, conn)
    conn.close()
