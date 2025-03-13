import random
import faker
import csv

# Initialize the Faker object to generate random names
fake = faker.Faker()

# Possible sexes
sexes = ['Male', 'Female']
health_status = ['OCDgen', 'Healthy']

# Generate 30 random entries
entries = []
for i in range(30):
    entry = {
        "id": i + 1,
        "path": str(str(i+1).zfill(2)+".png"),
        "patient_id": i + 1,
        "ai_diagnosis":  random.choice(health_status),
        "true_diagnosis": random.choice(health_status)
    }
    entries.append(entry)

# Define the CSV file name
csv_filename = 'GEN_image_table.csv'

# Writing to the CSV file
with open(csv_filename, mode='w', newline='') as file:
    writer = csv.DictWriter(file, fieldnames=["id", "path", "patient_id", "ai_diagnosis", "true_diagnosis"])
    writer.writeheader()  # Write the header (column names)
    writer.writerows(entries)  # Write the data rows

print(f"Data saved to {csv_filename}")

