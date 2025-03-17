let url_params;

function update_study_url(participant_id, study_id, page_nr)
{
    let new_url = "/page.study/index.html?";
    new_url += "participant_id=" +participant_id;
    new_url += "&study_id=" + study_id;
    new_url += "&page_nr=" + page_nr;
    window.location.href = new_url;
}

async function db_get_max_page_nr_and_set_url(participant_id, study_id) {
    console.log("Fetching max page number...");
    try {
        const response = await fetch(`/read_db_get_max_page_nr?participant_id=${participant_id}&study_id=${study_id}`);
        const data = await response.json();

        let page_nr = data.max_page_nr || 1;  // Default to page 1 if no records found
        console.log("Max page_nr:", page_nr);

        update_study_url(participant_id, study_id, page_nr);
    } catch (error) {
        console.error("Error fetching max page number:", error);
        update_study_url(participant_id, study_id, 1);  // Default to 1 on error
    }
}


document.addEventListener("DOMContentLoaded", function () {
    const start_button = document.getElementById("start_button");
    const participant_id_input = document.getElementById("participant_id"); // Renamed variable
    const study_id_input = document.getElementById("study_id"); // Renamed variable

    if (!start_button || !participant_id_input) {
        console.error("Required elements not found on the page.");
        return;
    }

    start_button.addEventListener("click", async () => {
        const participant_id = participant_id_input.value.trim(); // Store input value in a new variable
        const study_id = study_id_input.value.trim(); // Store input value in a new variable
    
        if (participant_id === "") {
            alert("Please enter a Participant ID.");
            return;
        }
        
        if (study_id === "") {
            alert("Please enter a Study ID.");
            return;
        }
        
        console.log("Participant ID entered:", participant_id); // Debugging log
        console.log("Study ID entered:", study_id); // Debugging log

        try {
            // Send a POST request to the server
            const response = await fetch('/post_participant_id', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                //participant_id may be changed by user via inputbox, however study_id can be passed only in the url
                body: JSON.stringify({ participant_id, study_id })
            });

            if (!response.ok) {
                alert('Error submitting participant ID.');
            }else{
                /*Resume Functionality - if db entry exist ( resume from the last updated page number )*/
                db_get_max_page_nr_and_set_url(participant_id, study_id);
                //page_nr = 1; //First Page After Login
                //update_study_url(participant_id, study_id, page_nr);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Something went wrong. Please try again.');
        }
    });
});

function getParamsFromURL() 
{
    const params = new URLSearchParams(window.location.search);

    return {
        participant_id: params.get('participant_id') ? decodeURIComponent(params.get('participant_id')) : null,
        study_id: params.get('study_id') ? decodeURIComponent(params.get('study_id')) : null
    };
}

window.onload = function() {
    url_params = getParamsFromURL();
    if(url_params.participant_id) document.getElementById('participant_id').value = url_params.participant_id;
    if(url_params.study_id) document.getElementById('study_id').value = url_params.study_id;
};
