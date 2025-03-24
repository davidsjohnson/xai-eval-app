import sqlite3
import sys
from tabulate import tabulate

import sqlite3
from tabulate import tabulate

def show_study_table():
    conn = sqlite3.connect("database/database.db")
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM study")
        records = cursor.fetchall()
    except:
        print("study table doesn´t exist")
        return
    # Fetch column names dynamically
    headers = [description[0] for description in cursor.description]

    if records:
        print(tabulate(records, headers=headers, tablefmt="grid"))
    else:
        print("No records found in the study table.")

    conn.close()

if __name__ == "__main__":
    show_study_table()
