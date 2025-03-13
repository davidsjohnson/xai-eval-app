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

function set_participant_diagnosis(val) {

    if (typeof val === "string") {
        val = val.toLowerCase(); 
    } else {
        console.error("Invalid diagnosis string received from DB");
        return false;
    }

    if (val === "healthy") {
        document.getElementById("radio-healthy").checked = true;
    } else if (val === "ocdegen") {
        document.getElementById("radio-unhealthy").checked = true;
    } else {
        console.error("Invalid value:", val);
        return false;
    }

    return true;
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

function get_x_ray_image()
{
    return x_ray_image.src;
}

function get_params_from_url() 
{
    const params = new URLSearchParams(window.location.search);

    return {
        participant_id: params.get('participant_id') ? decodeURIComponent(params.get('participant_id')) : null,
        study_id: params.get('study_id') ? decodeURIComponent(params.get('study_id')) : null
    };
}

async function db_update() 
{
    const url_params = get_params_from_url();
    const participant_diagnosis = get_radio_button_status();

    if (!url_params.participant_id) {
        alert("Error: URL doesn’t have participant_id");
        return;
    }

    if (!url_params.study_id) {
        alert("Error: URL doesn’t have study_id");
        return;
    }

    const participant_id = url_params.participant_id;
    const study_id = url_params.study_id;
    const xray_image_url = get_x_ray_image();
    const xray_image = xray_image_url.split('/').pop(); // Extracts "05.png"
    const page_index = g_curr_page_number; 

    try {
        const response = await fetch('/write_db', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ participant_id, study_id, xray_image, participant_diagnosis, page_index })
        });

        if (!response.ok) {
            alert('Error submitting participant ID.');
        } else {
            //const result = await response.json();
            //if (result.redirect) {
                // Get current URL parameters
            const url_params = new URLSearchParams(window.location.search);
            const current_participant_id = url_params.get('participant_id');
            const current_study_id = url_params.get('study_id');
            const current_page_index = g_curr_page_number; // assuming g_page_index is set
            const total_pages = g_total_page_count; // assuming g_total_page is set
            const prev_diagnosis = participant_diagnosis; // assuming participant_diagnosis is set
            let new_url = "/page.study/index.html?";
            new_url += "participant_id=" + current_participant_id;
            new_url += "&study_id=" + current_study_id;
            new_url += "&page_no=" + current_page_index;
            new_url += "&total_pages=" + total_pages;
            new_url += "&prev_diagnosis=" + encodeURIComponent(prev_diagnosis);

            alert(new_url);
                // Redirect to the new URL
            window.location.href = new_url;
            //}
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong. Please try again.');
    }
}


function next_button_action()
{
    //alert("Next button clicked!");
    let ret = get_radio_button_status();
    if(ret == null ){
        return;
    }
    
    db_update();

    if(g_curr_page_number >= g_total_page_count)
    {
        g_curr_page_number = g_total_page_count;
        window.location.href = "/page.feedback/index.html"; // Redirect to test.html
        return;
    }
    g_curr_page_number = g_curr_page_number + 1;
    set_progress(g_curr_page_number, g_total_page_count);
    clear_radio_buttons();
    csv_json_get_all_attributes_and_set_in_html_page();
}

async function db_get_participant_diagnosis(participant_id, study_id, page_index) {
    try {
        const response = await fetch(`/read_db_prev?participant_id=${participant_id}&study_id=${study_id}&page_index=${page_index}`);
        const data = await response.json();
        return data.participant_diagnosis || null;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}


function prev_button_action()
{
    //alert("Prev button clicked!");
    g_curr_page_number = (g_curr_page_number - 1);
    
    if(g_curr_page_number <= 0){
        g_curr_page_number = 1;
        return;
    }
    
    const url_params = get_params_from_url();
    diagnosis = db_get_participant_diagnosis(url_params.participant_id, url_params.study_id, g_curr_page_number);
    alert(diagnosis);
    if(!diagnosis){
        alert("Unable to fetch participant_diagnosis for the previous page: db_error");
        g_curr_page_number = g_curr_page_number + 1; // reset as we are not going to mvoe to prev page ( due to failure )
        return;
    }
    ret = set_participant_diagnosis(diagnosis);

    if(ret == false){
        return;
    }

    //Set all attributes from csv_json info
    csv_json_get_all_attributes_and_set_in_html_page();
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
function csv_json_get_total_page_count()
{
    return input.PATIENT_ID.length;
}

function csv_json_get_main_attributes(page_number)
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

function csv_json_get_all_attributes_and_set_in_html_page()
{
    attr = csv_json_get_main_attributes(g_curr_page_number);
    set_main_attributes_in_html_page(g_curr_page_number, attr);
}

function init()
{
    console.log('App is running!');
    g_total_page_count = csv_json_get_total_page_count();
    csv_json_get_all_attributes_and_set_in_html_page();
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
