import sql_helper
import pandas as pd

def make_polypharmacy_flag_cte(final_table: str, cohort_table: str):
    conn = sql_helper.connect_server()

    cur = conn.cursor()
    cur.execute(f"DROP TABLE IF EXISTS {final_table};")

    sql = f"""
CREATE TABLE {final_table} AS

-- limit exposures to 180 days around stroke
With windowed AS (
  SELECT
      sc.person_id,
      de.drug_concept_id,
      GREATEST(de.drug_exposure_start_date, DATEADD(day, -180, sc.condition_start_date))::date AS start_date,
      LEAST(de.drug_exposure_end_date,      DATEADD(day,  180, sc.condition_start_date))::date AS end_date
  FROM omop_cdm_53_pmtx_202203.drug_exposure de
  JOIN {cohort_table} sc
    ON de.person_id = sc.person_id
    WHERE de.drug_exposure_end_date   >= DATEADD(day, -180, sc.condition_start_date)
    AND de.drug_exposure_start_date <= DATEADD(day,  180, sc.condition_start_date)
),
windowed_clean AS (
  SELECT person_id, drug_concept_id, start_date, end_date
  FROM windowed
  WHERE start_date <= end_date
),
-- window function to mark the previous end date
ordered AS (
  SELECT
      person_id,
      drug_concept_id,
      start_date,
      end_date,
      LAG(end_date) OVER (
        PARTITION BY person_id, drug_concept_id
        ORDER BY start_date, end_date
      ) AS prev_end
  FROM windowed_clean
),
--- creates date ranges of overlapping dates
merged_intervals AS (
  SELECT
      person_id,
      drug_concept_id,
      MIN(start_date) AS start_date,
      MAX(end_date)   AS end_date
  FROM (
    SELECT
        person_id,
        drug_concept_id,
        start_date,
        end_date,
        SUM(
          CASE
            WHEN prev_end IS NULL OR start_date > DATEADD(day, 1, prev_end)
            THEN 1 ELSE 0
          END
        ) OVER (
          PARTITION BY person_id, drug_concept_id
          ORDER BY start_date, end_date
          ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) AS grp
    FROM ordered
  ) t
  GROUP BY person_id, drug_concept_id, grp
),
--  makes +1 and -1 flags to signify start and stop respectively
events AS (
  SELECT person_id, start_date AS event_date,  1  AS delta_change FROM merged_intervals
  UNION ALL
  SELECT person_id, DATEADD(day, 1, end_date) AS event_date, -1 AS delta_change FROM merged_intervals
),
-- creates a timeline of all patient and drugs
timeline AS (
  SELECT
      person_id,
      event_date,
      SUM(delta_change) OVER (
        PARTITION BY person_id
        ORDER BY event_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
      ) AS running_ct,
      LEAD(event_date) OVER (PARTITION BY person_id ORDER BY event_date) AS next_event_date
  FROM events
),
-- 5) segments where concurrency >= 5
high_segs AS (
  SELECT
      person_id,
      event_date      AS seg_start,
      next_event_date AS seg_end,
      running_ct
  FROM timeline
  WHERE next_event_date IS NOT NULL
    AND running_ct >= 5
),

-- stitch contiguous segments into continuous runs
grouped_high AS (
  SELECT
      person_id,
      seg_start,
      seg_end,
      running_ct,
      LAG(seg_end) OVER (
        PARTITION BY person_id
        ORDER BY seg_start, seg_end
      ) AS prev_end
  FROM high_segs
),
runs AS (
  SELECT
      person_id,
      seg_start,
      seg_end,
      running_ct,
      SUM(
        CASE WHEN prev_end IS NULL OR seg_start > prev_end THEN 1 ELSE 0 END
      ) OVER (
        PARTITION BY person_id
        ORDER BY seg_start, seg_end
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
      ) AS run_id
  FROM grouped_high
),
run_lengths AS (
  SELECT
      person_id,
      run_id,
      MAX(running_ct) AS running_ct,
      MIN(seg_start) AS run_start,
      MAX(seg_end)   AS run_end,
      DATEDIFF(day, MIN(seg_start), MAX(seg_end)) AS run_days
  FROM runs
  GROUP BY person_id, run_id
),
sustained_flag AS (
  SELECT
      person_id,
      MAX(running_ct) AS polypharmacy_count,
      CASE WHEN MAX(run_days) >= 30 THEN 1 ELSE 0 END AS has_polypharmacy,
      MIN(CASE WHEN run_days >= 30 THEN run_start END) AS first_pim_date
  FROM run_lengths
  GROUP BY person_id
)
SELECT
    {cohort_table}.*,
    COALESCE(sf.has_polypharmacy, 0) AS has_polypharmacy,
    COALESCE(sf.polypharmacy_count, 0) AS polypharmacy_count,
    sf.first_pim_date
FROM {cohort_table}
LEFT JOIN sustained_flag sf USING (person_id);
"""
    cur.execute(sql)
    conn.commit()
    print(f"Created {final_table}")

    cur.close()
    conn.close()


if __name__ == "__main__":
    make_polypharmacy_flag_cte(
        final_table="work_rizvanov_a263.stroke_cohort_flag_polypharmacy",
        cohort_table="work_rizvanov_a263.stroke_cohort_w_all_flags",
    )
