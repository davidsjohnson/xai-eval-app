let url_params;

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
                const result = await response.json();
                if (result.redirect) {
                    window.location.href = result.redirect; // Redirect manually
                }
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Something went wrong. Please try again.');
        }
    });
});

/*
function get_participant_id_from_url() {
    // Get the URL parameters
    const params = new URLSearchParams(window.location.search);

    // Get the value of 'id' parameter (e.g., '?id=123')
    const content = params.get('id');

    // Return decoded value or null if 'id' does not exist
    return content ? decodeURIComponent(content) : null;
}
*/

/*
function get_participant_id_from_url() {
    const params = new URLSearchParams(window.location.search);
    const content = params.get('id');

    // Check for null, undefined, or empty string
    return content ? decodeURIComponent(content).trim() || null : null;
}
*/

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
