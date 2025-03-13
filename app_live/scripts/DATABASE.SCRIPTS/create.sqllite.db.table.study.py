import sqlite3
import sys
import random

# Check if the database name is passed as a command-line argument
if len(sys.argv) < 5:
    print("Usage: python script_name.py <database_name> <table_name> <no pages> <no images per page>")
    sys.exit(1)

# Get the database name from the command-line argument
db_name    = sys.argv[1]
table_name = sys.argv[2]
num_pages  = int(sys.argv[3])
num_images_per_page = int(sys.argv[4])

# Create a connection to the SQLite database (the database will be created if it doesn't exist)
conn = sqlite3.connect(db_name)
cursor = conn.cursor()

columns = ['id INTEGER PRIMARY KEY']

# Add the dynamic columns (page1_image1_id, page2_image1_id, ..., page5_image1_id)
for p in range(1, num_pages + 1):
    for i in range(1, num_images_per_page + 1):
        columns.append(f'page{p}_image{i}_id INTEGER')

print(columns)
# Create the table using the dynamically generated columns
create_table_query = f"CREATE TABLE IF NOT EXISTS {table_name} ({', '.join(columns)});"
cursor.execute(create_table_query)
conn.commit()

flag_comma=False
insert_query_header = f"INSERT INTO {table_name} "
insert_query_body = ""
insert_query_footer = ""
# Insert data into the table
for p in range(1, num_pages + 1):
    for i in range(1, num_images_per_page + 1):
        if flag_comma == True:
            insert_query_body   = insert_query_body  + ","
            insert_query_footer = insert_query_footer + ","
            flag_comma = False

        insert_query_body   = insert_query_body + f"page{p}_image{i}_id"
        insert_query_footer = insert_query_footer + "?"
        flag_comma=True

insert_query_body = "(" + insert_query_body + ") "
insert_query_footer = "VALUES (" + insert_query_footer + ")"
insert_query = insert_query_header + insert_query_body + insert_query_footer

print(f"SQL Query: {insert_query}")

values = []  # Store random values for a single row

for p in range(1, num_pages + 1):
    for i in range(1, num_images_per_page + 1):
        value = random.randint(1, 30)  # Generate a random number between 1 and 30
        values.append(value)

# Execute the query with the generated random values
cursor.execute(insert_query, values)  # Insert the values
conn.commit()  # Commit after inserting the row

# Fetch and print the table content to verify
cursor.execute(f"SELECT * FROM {table_name};")
rows = cursor.fetchall()

for row in rows:
    print(row)

# Close the database connection
conn.close()

