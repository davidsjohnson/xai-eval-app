import csv
import json
import sys

def csv_to_json(csv_file_path, json_file_path):
    # Open the CSV file and read the content
    with open(csv_file_path, mode='r', encoding='utf-8') as csv_file:
        csv_reader = csv.DictReader(csv_file)  # Read the CSV as a dictionary
        rows = list(csv_reader)  # Convert rows into a list of dictionaries

    # Write the JSON file
    with open(json_file_path, mode='w', encoding='utf-8') as json_file:
        json.dump(rows, json_file, indent=4)  # Write the JSON with indentation for readability

def main():
    # Check if the correct number of arguments are provided
    if len(sys.argv) != 3:
        print("Usage: python csv_to_json.py <input_csv_file> <output_json_file>")
        sys.exit(1)

    # Get the input and output file paths from command line arguments
    csv_file = sys.argv[1]
    json_file = sys.argv[2]

    # Call the conversion function
    csv_to_json(csv_file, json_file)
    print(f"Successfully converted {csv_file} to {json_file}.")

if __name__ == "__main__":
    main()

