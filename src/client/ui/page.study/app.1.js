// Sync Load Json
const input = loadJsonDataSync();  // Blocking Call
console.log(input);  

const button_next = document.getElementById("button-next");
const button_prev = document.getElementById("button-prev");
const radio_buttons = document.getElementsByName("health");
const patient_id1 = document.getElementById("patient-id-location1");
const patient_id2 = document.getElementById("patient-id-location2");
const x_ray_location = document.getElementById("x-ray-location");
const suggested_diag1 = document.getElementById("suggested-diag-location1");
const suggested_diag2 = document.getElementById("suggested-diag-location2");
const true_diag   = document.getElementById("true-diag");
const x_ray_image = document.getElementById("patient-x-ray-image");

//image list
var g_total_page_count=10;
var g_curr_page_number=1;
var g_study_id   = 1;
/*
 function updateDatabase() {
            // Get the value from the input field
            const username = document.getElementById("username").value;

            // Check if the input is not empty
            if (!username) {
                alert("Please enter a name.");
                return;
            }

            // Send a POST request to the server to update the database
            fetch('/update-database', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: username }) // Send data to backend
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message); // Show server response message
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Something went wrong.');
            });
 }
*/
function loadJsonDataSync() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "input.json", false);  // 'false' makes it synchronous
  xhr.send();

  if (xhr.status === 200) {
    return JSON.parse(xhr.responseText);  // Return parsed JSON
  } else {
    console.error("Request failed with status", xhr.status);
    return null;
  }
}



function generate_random_string(length = 10) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}

function generate_random_diag() {
    const diag = ["OCDegen", "Healthy"];

    const random_index = Math.floor(Math.random() * diag.length);
    return diag[random_index];
}

function generate_random_image_name() {
    let num = Math.floor(Math.random() * 21); // Generate a number between 0 and 20
    digit = num.toString().padStart(2, "0"); // Convert to string and ensure two-digit format
    image_name = "img/" + digit + ".png"; 
    return image_name;
}

function get_radio_button_status()
{
    let selected_value = null; // To store the selected value
    for (const radio of radio_buttons) {
        if (radio.checked) {
            selected_value = radio.value; // Store the value of the checked radio button
            break; // Stop the loop once we find the checked radio
        }
    }

    if (!selected_value) {
        alert("Please select an option before proceeding!"); // If no option is selected
    }

    return selected_value;
}

function clear_radio_buttons() {
    for (const radio of radio_buttons) {
        radio.checked = false;
    }
}

function set_progress(current_page_number, total_page_count) {
    let progress_value = (current_page_number / total_page_count) * 100; // Convert to percentage
    let progress_bar = document.querySelector("footer .progress-bar");
    progress_bar.style.width = progress_value + "%";

    document.getElementById("progress-bar-text").textContent = "Diagnosis " + current_page_number.toString() + "/" + total_page_count.toString();
}

function set_patient_id(id)
{
    patient_id1.textContent = id.toString();
    patient_id2.textContent = "Patient ID: " + id.toString();
}

function set_x_ray_image(src)
{
    x_ray_image.src = src; 
}
function next_button_action()
{
    //alert("Next button clicked!");
    let ret = get_radio_button_status();
    if(ret == null ){
        return;
    }

    if(g_curr_page_number >= g_total_page_count)
    {
        g_curr_page_number = g_total_page_count;
        alert("Feedback Completed!");
        return;
    }
    g_curr_page_number = g_curr_page_number + 1;
    set_progress(g_curr_page_number, g_total_page_count);
    clear_radio_buttons();
    db_get_all_attributes_and_set_in_html_page(g_study_id);
}

function prev_button_action()
{
    //alert("Prev button clicked!");
    g_curr_page_number = (g_curr_page_number - 1);
    if(g_curr_page_number <= 0) g_curr_page_number = 1;
    set_progress(g_curr_page_number, g_total_page_count);
}

function set_suggested_diag(value)
{
    suggested_diag1.textContent = value;
    suggested_diag2.textContent = value;
    if(value == "OCDegen"){
        suggested_diag1.className = "";
        suggested_diag2.className = "";
        suggested_diag1.className = "unhealthy"
        suggested_diag2.className = "unhealthy"
    }else{
        suggested_diag1.className = "";
        suggested_diag2.className = "";
        suggested_diag1.className = "healthy"
        suggested_diag2.className = "healthy"
    }
}

function set_x_ray_location(value)
{
    x_ray_location.textContent = value;
}

function set_true_diag(value)
{
    true_diag.textContent = value;
    if(value == "OCDegen"){
        true_diag.className = ""
        true_diag.className = "unhealthy"
    }else{
        true_diag.className = ""
        true_diag.className = "healthy"
    }

}

//get total pagecount for the study
function db_get_total_page_count()
{
    return input.PATIENT_ID.length;
}

function db_get_main_attributes(page_number)
{

    index = page_number - 1;
    l_patient_id = input.PATIENT_ID[index];
    l_x_ray_loc  = input.X_RAY_LOCATION[index];
    l_true_diag = input.TRUE_DIAG[index];
    l_suggested_diag = input.SUGGESTED_DIAG[index];
    l_image = "img/" + input.X_RAY_IMAGE[index];
    attributes = [l_patient_id, l_image, l_x_ray_loc, l_true_diag, l_suggested_diag] 
    return attributes; 
}

function set_main_attributes_in_html_page(page_number, attr)
{
    //attributes = [patient_id, image, x_ray_loc, true_diag, suggested_diag] 
    set_patient_id(attr[0]);
    set_x_ray_image(attr[1]);
    set_x_ray_location(attr[2]);
    set_true_diag(attr[3]);
    set_suggested_diag(attr[4])
    set_progress(page_number, g_total_page_count);
}

function db_get_all_attributes_and_set_in_html_page(study_id)
{
    g_total_page_count = db_get_total_page_count();
    attr = db_get_main_attributes(g_curr_page_number);
    set_main_attributes_in_html_page(g_curr_page_number, attr);
}

function init()
{
    console.log('App is running!');
    db_get_all_attributes_and_set_in_html_page(g_study_id);
}

function main()
{
    document.addEventListener('DOMContentLoaded', function() {init();});

    button_next.addEventListener("click", function() {
        next_button_action();
    });

    button_prev.addEventListener("click", function() {
        prev_button_action();
    });
}

main()
