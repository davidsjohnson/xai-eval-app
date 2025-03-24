# Blockie X-Ray Image Evaluation Web App

## Directory Structure

```
- src/client/ui        # User interface source code (HTML, CSS, JavaScript)
- src/server          # Web server logic and source code (Node.js)
- src/Dockerfile      # Docker instructions to create an image and run the web app
- database/           # Database (created during Docker container execution)
- app_live/           # Sandbox environment auto-generated during build process
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
./docker.build.sh <number_of_images> <input.csv>
```
- This process creates a Docker image.
- The Docker image uses the `web server` and `client (UI)` from the `app_live` directory.
- The `database` directory is used to store the database.

## Running the Project

To start the application, use (ubuntu users):
```bash
./docker.start.ubuntu.sh
```
To start the application, use (mac osx users):
```bash
./docker.start.mac.osx.sh
```
## Accessing the Application

Open a browser and navigate to:
```
http://0.0.0.0:7000/index.html?participant_id=123&study_id=456
```

## Exporting Participant Feedback

After the feedback session, you can export data from the database using:
```
http://0.0.0.0:7000/page.db.reader/index.html
```
- Use the **Export to CSV** button to download the data.

## Stopping the Project

To stop the running Docker container, execute (ubuntu users):
```bash
./docker.stop.ubuntu.sh
```
To stop the running Docker container, execute (mac osx users):
```bash
./docker.stop.mac.osx.sh
```

## Code Modification

    1. Client-side code can be modified live, and the effects can be seen immediately.
    2. When server-side code is modified, the Docker container needs to be rebuilt.



## Tested OS

    1. Ubuntu 24.04

---

## Notes
- The `app_live` directory is auto-generated and contains the running code of the Docker-based app.
- Users do not need to modify `app_live` manually.
- The `database` folder will be created dynamically when the application runs.


## Bugs

- **1. Previous Page Issue:** The "Previous Page" functionality is not working correctly; it does not properly retrieve the participant's diagnosis.


