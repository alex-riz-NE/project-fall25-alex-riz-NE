import sql_helper
import pandas as pd
from pathlib import Path

def get_meds_and_mh_lists(conn):
    data_dir = Path(__file__).resolve().parent.parent / "data"
    file_path = data_dir / "V8_MH_PIMs.xlsx"

    #### Medications
    antidep = pd.read_excel(file_path, sheet_name="antidep")[['concept_id','Route','atc_class','concept_name']]
    antipsych = pd.read_excel(file_path, sheet_name="antipsych")[['concept_id','Route', 'atc_class','concept_name']]
    anxiolytic = pd.read_excel(file_path, sheet_name="anxiolytic")[['concept_id','Route', 'atc_class','concept_name']]
    hyp_sed = pd.read_excel(file_path, sheet_name="hyp_sed")[['concept_id','Route', 'atc_class','concept_name']]



    all_medications_mapped = pd.concat([antidep, antipsych, anxiolytic,hyp_sed], ignore_index=True)
    all_medications_mapped=all_medications_mapped[all_medications_mapped['Route']=="PO"].drop("Route", axis=1)
    #sql_helper.upload_df(all_medications_mapped,"work_rizvanov_a263.medication_list",conn )

    ### Mental Health
    siezure=pd.read_excel(file_path, sheet_name="all_seizure")
    siezure=siezure[siezure['Keep']==1]
    siezure=siezure[['concept_id', 'concept_name', 'hx']].rename(columns={"hx": "condition_group"})
    all_mh_hx = pd.read_excel(file_path, sheet_name="all_mh_hx")
    all_mh_hx=all_mh_hx[all_mh_hx['Keep']==1]
    all_mh_hx=all_mh_hx[['concept_id', 'concept_name', 'hx']].rename(columns={"hx": "condition_group"})
    all_med=pd.concat([siezure,all_mh_hx])
    sql_helper.upload_df(all_med,"work_rizvanov_a263.mental_health_list",conn )


if __name__ == "__main__":
    conn=sql_helper.connect_server()
    get_meds_and_mh_lists(conn)
    #get_dementia_list(conn)