"""
Description: Create a new record in study table and generate application code for the new study

Author: Vignesh Natarjan
Contact: vnatarajan@uni-bielefeld.de
"""


import sqlite3
import sys
import sys
import csv
from tabulate import tabulate

database="database/database.db"

def create_study_table():
    conn = sqlite3.connect(database)
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS study (
            study_id INTEGER PRIMARY KEY,
            study_type INTEGER CHECK(study_type IN (1, 2, 3, 4)),
            total_pages INTEGER
        )
    ''')

    conn.commit()
    conn.close()

def create_record_in_study_table(study_id, study_type, total_pages):
    create_study_table()  # Ensure the table exists before inserting
    conn = sqlite3.connect(database)
    cursor = conn.cursor()

    try:
        cursor.execute("INSERT INTO study (study_id, study_type, total_pages) VALUES (?, ?, ?)",
                       (study_id, study_type, total_pages))
        conn.commit()
        print("Record inserted successfully.")
    except sqlite3.IntegrityError:
        print("Error: Could not insert record. Study ID might already exist or constraints violated.")
        exit(3)

    conn.close()

def show_study_table():
    conn = sqlite3.connect(database)
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

def count_rows_in_csv(file_path):
    try:
        with open(file_path, mode='r', newline='', encoding='utf-8') as file:
            reader = csv.reader(file)
            header = next(reader)  # Skip the header
            row_count = sum(1 for row in reader)  # Count the remaining rows
            print(f"Number of rows (excluding header): {row_count}")
        return row_count
    except FileNotFoundError:
        print(f"File not found: {file_path}")
        return 0
    except Exception as e:
        print(f"An error occurred: {e}")
        return 0

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python script.py <study_id> <study_type: representing number of images in study page> <csv_input_file>")
    else:
        try:
            study_id = int(sys.argv[1])
            study_type = int(sys.argv[2])
            csv_file = sys.argv[3]

            total_pages = count_rows_in_csv(csv_file)
            if total_pages <= 0:
                print(f"error: unable to get total record ( or page count ) from {csv_file}")

            create_record_in_study_table(study_id, study_type, total_pages)
            show_study_table()
        except ValueError:
            print("Error: All arguments must be integers.")
