"""
Description: Export study table to csv file

Author: Vignesh Natarjan
Contact: vnatarajan@uni-bielefeld.de
"""


import sqlite3
import csv
import sys

def export_to_csv(db_name, table_name, csv_file):
    try:
        conn = sqlite3.connect(db_name)
        cursor = conn.cursor()

        cursor.execute(f"SELECT * FROM {table_name}")
        rows = cursor.fetchall()

        column_names = [description[0] for description in cursor.description]

        with open(csv_file, mode='w', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow(column_names)   # Write header
            writer.writerows(rows)          # Write data

        print(f"Data exported successfully to {csv_file}")

    except sqlite3.Error as e:
        print(f"SQLite error: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python script.py <output.csv>")
    else:
        db="database/database.db"
        table="study"
        csvfile=sys.argv[1]
        export_to_csv(db, table, csvfile)
