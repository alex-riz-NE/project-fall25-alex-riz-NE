import numpy as np
import config
import pandas as pd
import redshift_connector
import sys
import yaml
import os



def connect_server():
    conn = redshift_connector.connect(
        host=config.DB_HOST,
        port=5439,
        database=config.DB_NAME,
        user=config.DB_USER,
        password=config.DB_PASSWORD
    )
    print("Connected successfully!")
    return conn

    
def query_to_table(query, conn):
    cur = conn.cursor()
    cur.execute(query)
    rows = cur.fetchall()
    columns = [desc[0] for desc in cur.description]
    cur.close()
    # Create Pandas DataFrame
    return pd.DataFrame(rows, columns=columns)

def query_to_list(query, conn):
    cur = conn.cursor()
    cur.execute(query)
    rows = [row[0] for row in cur.fetchall()]  # take first column only
    cur.close()
    return rows


def run_query(query, conn, view=True):
    curr = conn.cursor()
    curr.execute(query)


    if view:
        columns = [desc[0] for desc in curr.description]
        print(" | ".join(columns))
        for row in curr.fetchall():
            print(row)

    curr.close()

def map_dtype_to_redshift(dtype):
    if np.issubdtype(dtype, np.integer):
        return "BIGINT"
    elif np.issubdtype(dtype, np.floating):
        return "DOUBLE PRECISION"
    elif np.issubdtype(dtype, np.datetime64):
        return "TIMESTAMP"
    else:
        return "VARCHAR(5000)"  # catch-all for strings, objects, etc.


def upload_df(df, table_name, conn):
    cur = conn.cursor()
    cur.execute(f"DROP TABLE IF EXISTS {table_name};")
    conn.commit()
    print(f"Dropped table {table_name} if exsisted")

    columns_sql = []
    for col, dtype in df.dtypes.items():
        sql_type = map_dtype_to_redshift(dtype)
        columns_sql.append(f"{col} {sql_type}")
    create_stmt = f"CREATE TABLE IF NOT EXISTS {table_name} (\n  " + ",\n  ".join(columns_sql) + "\n);"

    print(f"Starting  to upload {table_name}")
    cur.execute(create_stmt)
    conn.commit()
    print(f"Created table {table_name}")

    placeholders = ", ".join(["%s"] * len(df.columns))
    insert_stmt = f"INSERT INTO {table_name} ({', '.join(df.columns)}) VALUES ({placeholders})"
    data_tuples = [tuple(None if pd.isna(x) else x for x in row) for row in df.to_numpy()]

    cur.executemany(insert_stmt, data_tuples)
    conn.commit()
    cur.close()
    print(f"Inserted {len(df)} rows into {table_name}")

def check_table_exsist(table_name, conn):
    curr=conn.cursor()
    query=f'''
    SELECT EXISTS (
    SELECT 1
    FROM information_schema.tables 
    WHERE table_schema = '{table_name.split('.')[0]}'
      AND table_name = '{table_name.split('.')[1]}'
    );'''  
    return curr.execute(query)






