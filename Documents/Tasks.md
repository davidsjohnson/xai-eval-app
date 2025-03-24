1. Now we integrated all code in one folder
2. give a script generate.study.sh <study_id> <study_type> <input.csv>
    - What is does
    - create a folder with app_live/study_id/
    - store the pages in app_live/study_id/index.html, study, db, feedback
    - <study type> says the page will have 1 image 2 image 3 image 4 image
    - this app_live is a shared directory app_live and db both are shared
    - create an entry in db for study_id and the study_type
    - generate csv to json and store in app_live/study_id/
    - if a study_id already exist alert
    - generate an unique url for the study
    - This way all can run simultaneously
