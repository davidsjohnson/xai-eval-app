/**
 * Description: Client logic for login page
 *
 * Author: Vignesh Natarjan
 * Contact: vnatarajan@uni-bielefeld.de
 */


let url_params;

function update_study_url(participant_id, study_id, study_type, page_nr, total_pages)
{
    let new_url = "/study_id_";
    new_url += study_id + "/";
    new_url += "index.html?";
    new_url += "participant_id=" +participant_id;
    new_url += "&study_id=" + study_id;
    new_url += "&study_type=" + study_type;
    new_url += "&page_nr=" + page_nr;
    new_url += "&total_pages=" + total_pages;

    if (page_nr === total_pages){
        let feedback_url = "/feedback_already_completed/index.html?";
        feedback_url += "participant_id=" +participant_id;
        feedback_url += "&study_id=" + study_id;
        window.location.href = feedback_url;
        return;
    }else{
        window.location.href = new_url;
    }

}

async function db_get_study_details(study_id) {
    console.log("Fetching study details...");
    try {
        const response = await fetch(`/read_db_get_study_details?study_id=${study_id}`);
        const data = await response.json();

        if (response.ok) {
            console.log("Study details:", data);
            return data;
        } else {
            console.error("Error response:", data.error);
            return null;
        }
    } catch (error) {
        console.error("Error fetching study details:", error);
        return null;
    }
}


function validate_24_digit_alpha_numeric(input) {
    // Check if input is exactly 16 alphanumeric characters
    var regex = /^[a-zA-Z0-9]{24}$/;

    if (!regex.test(input)) {
        return false;
    }
    return true;
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

        if (validate_24_digit_alpha_numeric(participant_id) === false) {
            alert("Error: The participant_id must be 24 alphanumeric characters.");
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
            const response = await fetch('/db_validation_participant_id_and_study_id', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ participant_id, study_id }) // Send participant_id and study_id
            });

            // Parse JSON response
            const data = await response.json();

            if (!response.ok) {
                console.error("Server Error:", data.error); // Print server error message
                alert(`Error: ${data.error}`); // Display error message
            } else {
                console.log("Study Details Received:", data);

                study_type =  data.study_type;
                page_nr = data.last_updated_page_nr;
                total_pages = data.total_pages;
                console.log(`Study Type: ${study_type}, Last Updated Page ${page_nr}, Total Pages: ${total_pages}`);

                update_study_url(participant_id, study_id, study_type, page_nr, total_pages);

            }
        } catch (error) {
            console.error("Request Error:", error);
            alert("Something went wrong. Please try again.");
        }

    });
});

function get_params_from_url()
{
    const params = new URLSearchParams(window.location.search);

    return {
        participant_id: params.get('participant_id') ? decodeURIComponent(params.get('participant_id')) : null,
        study_id: params.get('study_id') ? decodeURIComponent(params.get('study_id')) : null
    };
}

window.onload = function() {
    url_params = get_params_from_url();
    if(url_params.participant_id) document.getElementById('participant_id').value = url_params.participant_id;
    if(url_params.study_id) document.getElementById('study_id').value = url_params.study_id;
};
