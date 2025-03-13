import random
import faker
import csv

# Initialize the Faker object to generate random names
fake = faker.Faker()

# Possible sexes
sexes = ['Male', 'Female']

# Generate 30 random entries
entries = []
for i in range(30):
    entry = {
        "id": i + 1,
        "name": fake.name(),
        "sex": random.choice(sexes),
        "age": random.randint(18, 45)  # Random age between 18 and 45
    }
    entries.append(entry)

# Define the CSV file name
csv_filename = 'GEN_participant_table.csv'

# Writing to the CSV file
with open(csv_filename, mode='w', newline='') as file:
    writer = csv.DictWriter(file, fieldnames=["id", "name", "sex", "age"])
    writer.writeheader()  # Write the header (column names)
    writer.writerows(entries)  # Write the data rows

print(f"Data saved to {csv_filename}")

