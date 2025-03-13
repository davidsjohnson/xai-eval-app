import csv
import json
import sys

def csv_to_json(input_csv, output_json):
    # Initialize a dictionary to store lists for each column
    data = {}

    # Open the CSV file and read the content
    with open(input_csv, mode='r', encoding='utf-8') as csv_file:
        csv_reader = csv.DictReader(csv_file)  # Read the CSV as a dictionary
        for row in csv_reader:
            for column, value in row.items():
                # If the column is not already in the dictionary, initialize an empty list
                if column not in data:
                    data[column] = []
                # Append the value of the column to the respective list
                if value:
                    data[column].append(value)

    # Write the structured data into the output JSON file
    with open(output_json, mode='w', encoding='utf-8') as json_file:
        json.dump(data, json_file, indent=4)

    print(f"Successfully converted {input_csv} to {output_json}.")

def main():
    # Check if the correct number of arguments are provided
    if len(sys.argv) != 3:
        print("Usage: python csv_to_json.py <input_csv_file> <output_json_file>")
        sys.exit(1)

    # Get the input and output file paths from command line arguments
    input_csv = sys.argv[1]
    output_json = sys.argv[2]

    # Call the conversion function
    csv_to_json(input_csv, output_json)

if __name__ == "__main__":
    main()

