"""
Description: Initialize Database ( Create participant_feedback and study table if not exist )

Author: Vignesh Natarjan
Contact: vnatarajan@uni-bielefeld.de
"""

import sqlite3
import os

def create_database():
    db_path = "database/database.db"
    os.makedirs(os.path.dirname(db_path), exist_ok=True)

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS participant_feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            participant_id TEXT NOT NULL,
            study_id INTEGER NOT NULL,
            xray_image TEXT NOT NULL,
            participant_diagnosis TEXT NOT NULL,
            page_nr INTEGER NOT NULL
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS study (
            study_id INTEGER PRIMARY KEY,
            study_type INTEGER CHECK(study_type IN (1, 2, 3, 4)),
            total_pages INTEGER
        )
    ''')

    conn.commit()
    conn.close()
    print("Database and tables created successfully.")

def main():
    create_database()

main()
