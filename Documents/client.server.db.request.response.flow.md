# Client Server DB Request Response Flow ( Model View Controller )

1. Participant Enters Login Page ( Client Request ). The request contain the following information encoded as part of the url
    - participant_id
    - study_id
    - study_type

  url: http://localhost:7000/index.html?participant_id=a&study_id=b&study_type=c

2. Once login is successful the page transition to study page with the following information

    - participant_id
    - study_id
    - study_type
    - page_nr / =1 if the feedback is freshly started if it a resume feedback =last_updated_page_number )
    - total_pages ( total_pages : total number of pages available in the study ) 

  url: http://localhost:7000/study/<study_type>/index.html?participant_id=a&study_id=b&study_type=c&page_nr=d&total_pages=e

  there are 4 study_type 1, 2, 3, 4. the number representing the number of images in the study feedback page

3. On successful completion of the feedback. A feedback completion page appears.
    - url: http://localhost:7000/feedback/index.html


