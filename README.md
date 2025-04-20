# Explainable Artificial Intelligence: Human vs AI Diagnosis Evaluation Application

This project aims to develop an interactive web-based interface for collecting human feedback on medical diagnoses made by AI models. The specific use case focuses on a fictional condition called **Osteocuboid Degeneration (OCDegen)** in imaginary creatures known as **Blockies**.

The goal is to explore and evaluate **human-AI collaboration** in high-stakes decision-making scenarios, using **explainability** and **trust** as key design components.

## More Information on Blockies and OCDegen

This project builds on research that introduces Blockies and OCDegen as part of a study into human trust in AI.

#### Reference:

David S. Johnson
**"Higher Stakes, Healthier Trust? An Application-Grounded Approach to Assessing Healthy Trust in High-Stakes Human-AI Collaboration."**
*arXiv:2503.03529 (2025)*
DOI: [10.48550/arXiv.2503.03529](https://doi.org/10.48550/arXiv.2503.03529) 
[View on arXiv](https://arxiv.org/abs/2503.03529)


## Project Directory Structure

```
- src/client/         # User interface source code (HTML, CSS, JavaScript)
- src/server          # Web server logic and source code (Node.js)
- src/Dockerfile      # Docker instructions to create an image and run the web app
- database/           # Database (created during Docker container execution)
- docker.build.sh     # Script to build the application in Docker and generate an image
- docker.start.sh     # Script to start the Docker container from the generated image
- docker.stop.sh      # Script to stop the running Docker container
```

## Input Requirements

Before building the project, ensure the following input structure:

```
- input/img/         # Contains blockie images
- input/input.csv    # CSV file containing input data
```

### CSV File Format

| PATIENT_ID | X_RAY_IMAGE | TRUE_DIAG | SUGGESTED_DIAG | Concept1 | Concept1_Caption | Concept2 | Concept2_Caption | Concept3 | Concept3_Caption | X_RAY_LOCATION |
|------------|-------------|-----------|----------------|----------|------------------|----------|------------------|----------|------------------|----------------|

#### Image Count Rules:
- **Single Image Page:** No need for Concept1-3 and their captions.
- **Two Image Page:** No need for Concept1 and its caption.
- **Three Image Page:** No need for Concept1-2 and their captions.
- **Four Image Page:** No need for Concept1-3 and their captions.

## Building the Project

Run the following command:

```bash
./docker.build.sh
```

- This script creates a Docker image.
- The Docker image uses the `web server` code from the **src/server** directory.

## Running the Project

To start the application (for Ubuntu users), run:

```bash
./docker.start.sh
```

- This script runs a Docker container based on the image created in the previous step.
- The **database/database.db** file contains the database tables (**participant_feedback** and **study**).
- The **src/client** folder (which contains the client logic) is shared between the Docker container and the host.
- The web application runs under tcp port 7000

## Creating a New Study

Use the following command to create a new study:

```bash
./db.create.new.study <study_id> <study_type> <input_csv_file> <study_image_dir>
```

- For each new study, the application code is stored under **src/client/study_id_[study_id]**.
- A unified database (**database/database.db**) is used for all studies.
- There is no need to rebuild the Docker image when creating a new study, as the web server dynamically updates in real time.


## Accessing the Application

Open a browser and navigate to:
```
http://0.0.0.0:7000/index.html?participant_id=<24 digit alpha numeric>&study_id=<study id>
```

## Exporting Participant Feedback

After the feedback session, you can export data from the database using:
```
http://0.0.0.0:7000/db/index.html
```
- Use the **Export to CSV** button to download the data.

## Stopping the Project

To stop the running Docker container, execute (ubuntu users):
```bash
./docker.stop.sh
```
## Useful Scripts

1. `db.show.study.table` - Show records in the study table.
2. `db.show.participant_feedback.table` - Show records in the participant feedback table.
3. `db.export.study.table.to.csv`  - Export study table to csv
4. `db.export.participant.feedback.table.to.csv`- Export participant feedback table to csv

## Code Modification

1. Client-side code can be modified live, and the effects can be seen immediately.
2. When server-side code is modified, the Docker container needs to be rebuilt.

## Tested OS

- Ubuntu 24.04

---

## Notes

- The `database` folder will be created dynamically when the application runs.

