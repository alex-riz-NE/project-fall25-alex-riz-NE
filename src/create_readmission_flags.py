import pandas as pd
import sql_helper


def get_readmissions(conn):
    query = f'''
    CREATE TABLE work_rizvanov_a263.stroke_cohort_with_readmission_counts AS

    WITH ed_visits AS (
        SELECT
            pf.person_id,
            vo.visit_occurrence_id,
            vo.visit_start_date
        FROM omop_cdm_53_pmtx_202203.visit_occurrence vo
        JOIN work_rizvanov_a263.stroke_cohort_flag_polypharmacy pf
            ON vo.person_id = pf.person_id
        WHERE pf.any_pim > 0
            AND vo.visit_start_date >= pf.first_pim_date
            AND vo.visit_start_date <= DATEADD(day, 180, pf.first_pim_date)
            AND vo.visit_start_date <> pf.condition_start_date

            -- ED (9203 or descendants)
            AND vo.visit_concept_id IN (
                SELECT descendant_concept_id
                FROM omop_cdm_53_pmtx_202203.concept_ancestor
                WHERE ancestor_concept_id = 9203
            )
    ),

    readmission_windows AS (
        SELECT
            pf.person_id,
            COUNT(*) AS readmission_180d,
            COUNT(CASE WHEN visit_start_date <= DATEADD(day, 30, first_pim_date) THEN 1 END) AS readmission_30d,
            COUNT(CASE WHEN visit_start_date <= DATEADD(day, 90, first_pim_date) THEN 1 END) AS readmission_90d
        FROM ed_visits e
        JOIN work_rizvanov_a263.stroke_cohort_flag_polypharmacy pf
            ON e.person_id = pf.person_id
        GROUP BY pf.person_id
    )

    SELECT
        pf.*,
        COALESCE(rw.readmission_180d, 0) AS readmission_180d,
        COALESCE(rw.readmission_30d, 0) AS readmission_30d,
        COALESCE(rw.readmission_90d, 0) AS readmission_90d
    FROM work_rizvanov_a263.stroke_cohort_flag_polypharmacy pf
    LEFT JOIN readmission_windows rw
        ON pf.person_id = rw.person_id;
    '''

    cur = conn.cursor()
    cur.execute(query)
    conn.commit()
    conn.close()

if __name__ == "__main__":
    conn = sql_helper.connect_server()
    get_readmissions(conn)
