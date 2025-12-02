/**
 * Description: Client logic for study page with four images
 *
 * Author: V Natarjan
 */


let input = null;

const button_next = document.getElementById("button-next");
const button_prev = document.getElementById("button-prev");
const button_submit = document.getElementById("button-submit");
const radio_buttons = document.getElementsByName("health");
// const patient_id1 = document.getElementById("patient-id-location1");
const patient_id2 = document.getElementById("patient-id-location2");
const x_ray_location = document.getElementById("x-ray-location");
// const suggested_diag1 = document.getElementById("suggested-diag-location1");
const suggested_diag2 = document.getElementById("suggested-diag-location2");
const true_diag = document.getElementById("true-diag");
const x_ray_image = document.getElementById("patient-x-ray-image");
const x_ray_trait_span = document.getElementById("X_RAY_Trait");

function redirectIfFinished() {
    const pid = get_participant_id_from_url();
    const sid = get_study_id_from_url();
    if (sessionStorage.getItem(`study_done_${pid}_${sid}`) === 'true') {
        window.location.replace(`/feedback/index.html?participant_id=${pid}&study_id=${sid}`);
    }
}

/* run on normal page load */
redirectIfFinished();

/* run again if the page is restored from bfcache */
window.addEventListener('pageshow', (evt) => {
    if (evt.persisted) redirectIfFinished();
});



let diagnosis = null;



function get_radio_button_status() {
    let selected_value = null; // To store the selected value
    for (const radio of radio_buttons) {
        if (radio.checked) {
            selected_value = radio.value; // Store the value of the checked radio button
            break; // Stop the loop once we find the checked radio
        }
    }

    if (!selected_value) {
        console.log("WARN: Please select an option before proceeding!"); // If no option is selected
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

function set_progress(current_page_nr, total_page_count) {
    let progress_value = (current_page_nr / total_page_count) * 100; // Convert to percentage
    let progress_bar = document.querySelector("header .progress-bar");
    progress_bar.style.width = progress_value + "%";

    document.getElementById("progress-bar-text").textContent = "Diagnosis " + current_page_nr.toString() + "/" + total_page_count.toString();
}

function set_patient_id(id) {
    // patient_id1.textContent = id.toString();
    patient_id2.textContent = "X-Ray ID: " + id.toString();
}

function set_x_ray_image(src) {
    x_ray_image.src = src;
}

function get_x_ray_image() {
    return x_ray_image.src;
}

function set_x_ray_trait(val) {
    x_ray_trait_span.textContent = val;
}



function update_study_url(participant_id, study_id, study_type, page_nr, total_pages) {
    let new_url = "/study_id_";
    new_url += study_id + "/";
    new_url += "index.html?";
    new_url += "participant_id=" + participant_id;
    new_url += "&study_id=" + study_id;
    new_url += "&study_type=" + study_type;
    new_url += "&page_nr=" + page_nr;
    new_url += "&total_pages=" + total_pages;
    // window.location.href = new_url;

    // Push new URL into history without reloading
    window.history.pushState({}, '', new_url);
}

async function log_page_visit(participant_id, study_id, page_nr) {
    console.log('logging visit:', participant_id, study_id, page_nr);

    try {
        const response = await fetch('/log_visit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ participant_id, study_id, page_nr })
        });

        const response_data = await response.json(); // Read JSON response

        if (!response.ok) {
            console.error('Failed to log visit:', response_data);
        }
    } catch (error) {
        console.error('Error logging visit:', error);
    }
}

async function db_update_async() {
    console.log("Updating database...");
    const participant_diagnosis = get_radio_button_status();
    let participant_id = get_participant_id_from_url();
    let study_id = get_study_id_from_url();
    let page_nr = get_page_nr_from_url();

    if (!participant_id) {
        console.log("Error: URL doesn’t have participant_id");
        return;
    }

    if (!study_id) {
        console.log("Error: URL doesn’t have study_id");
        return;
    }

    let xray_image_url = get_x_ray_image();
    let xray_image = xray_image_url;
    //let xray_image = xray_image_url.split('/').pop(); // Extracts "05.png"

    try {
        const response = await fetch('/write_db', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ participant_id, study_id, xray_image, participant_diagnosis, page_nr })
        });

        const response_data = await response.json(); // Read JSON response

        if (!response.ok) {
            if (response.status === 400 && response_data.error === "DUPLICATE ENTRY") {
                console.log('Entry already exists. Cannot submit duplicate.');
                db_update_duplicate_entry_action(participant_id, study_id, page_nr);
                //ToDo: Get and Set actual Entry in the database ( Diagnosis )
            } else {
                console.log('Database error occurred. Please try again.');
            }
        } else {
            db_update_success_action(participant_id, study_id, page_nr);
        }
    } catch (error) {
        console.error('Error:', error);
        console.log('Something went wrong. Please try again.');
    }

}

async function db_update() {
    try {
        //await function make the fn block until it completes exec
        await db_update_async();
        console.log("Database update completed successfully.");
    } catch (error) {

        console.error("Error during database update:", error);
    }
}

function db_update_success_action(participant_id, study_id, current_page_nr) {
    //Last Page
    if (current_page_nr >= csv_json_get_total_page_count()) {
        const feedback_url = `/feedback/index.html?participant_id=${participant_id}&study_id=${study_id}`;

        /* NEW — remember that this study is done in this tab */
        sessionStorage.setItem(`study_done_${participant_id}_${study_id}`, 'true');

        window.location.replace(feedback_url);
        return;
    }

    //increment page number
    page_nr = current_page_nr + 1;
    up = get_params_from_url();
    update_study_url(participant_id, study_id, up.study_type, page_nr, up.total_pages);
    clear_radio_buttons();
    csv_json_get_all_attributes_and_set_in_html_page(page_nr);
    db_get_and_set_participant_diagnosis(participant_id, study_id, page_nr);
    button_toggle_next_or_submit();
    log_page_visit(participant_id, study_id, page_nr);
}

function button_toggle_next_or_submit() {
    const up = get_params_from_url();
    let total_pages = parseInt(up.total_pages, 10);
    let curr_page = parseInt(up.page_nr, 10);

    // If page_nr is missing or not a number, treat it as page 1
    if (isNaN(curr_page) || curr_page < 1) { curr_page = 1; }
    if (isNaN(total_pages) || total_pages < 1) { total_pages = 1; }

    /* default state: show both buttons in normal style */
    button_prev.style.display = 'inline-block';
    button_prev.disabled = false;
    button_next.style.display = 'inline-block';
    button_next.disabled = get_radio_button_status() === null;
    button_submit.disabled = true;

    /* ---- first page: hide Prev ---- */
    if (curr_page === 1) {
        // button_prev.style.display = 'none';
        button_prev.disabled = true;
        return;
    }

    /* last page: show Prev + floating Submit */
    if (curr_page === total_pages) {
        button_next.disabled = true;
        return;
    }
}

function db_update_duplicate_entry_action(participant_id, study_id, current_page_nr) {
    //Last Page
    if (current_page_nr >= csv_json_get_total_page_count()) {
        sessionStorage.setItem(`study_done_${participant_id}_${study_id}`, 'true');
        window.location.replace(`/feedback/index.html?participant_id=${participant_id}&study_id=${study_id}`);
        return;
    }

    //increment page number
    page_nr = current_page_nr + 1;
    up = get_params_from_url();
    update_study_url(participant_id, study_id, up.study_type, page_nr, up.total_pages);
    clear_radio_buttons();
    csv_json_get_all_attributes_and_set_in_html_page(page_nr);
    db_get_and_set_participant_diagnosis(participant_id, study_id, page_nr);
    log_page_visit(participant_id, study_id, page_nr);
}



function next_button_action() {
    let ret = get_radio_button_status();
    if (ret == null) {
        alert("Please select an option before proceeding to the next page.");
        return;
    }

    db_update();
}

async function db_get_and_set_participant_diagnosis_prev_button_click(participant_id, study_id, page_nr) {
    console.log("db_get_and_set_participant_diagnosis_prev_button_click");
    try {
        const response = await fetch(`/read_db_prev?participant_id=${participant_id}&study_id=${study_id}&page_nr=${page_nr}`);
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
            diagnosis = data[0].participant_diagnosis;
            //First URL Update
            up = get_params_from_url();
            update_study_url(participant_id, study_id, up.study_type, page_nr, up.total_pages);
            set_participant_diagnosis(diagnosis);
            //Set all attributes from csv_json info
            csv_json_get_all_attributes_and_set_in_html_page(page_nr);
            log_page_visit(participant_id, study_id, page_nr);
            console.log(diagnosis);
        }
        button_toggle_next_or_submit();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function db_get_and_set_participant_diagnosis(participant_id, study_id, page_nr) {
    console.log("db_get_participant_diagnosis");
    try {
        const response = await fetch(`/read_db_prev?participant_id=${participant_id}&study_id=${study_id}&page_nr=${page_nr}`);
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
            diagnosis = data[0].participant_diagnosis;
            set_participant_diagnosis(diagnosis);
            console.log(diagnosis);
        }
        button_toggle_next_or_submit();
    } catch (error) {
        console.error('Error fetching data:', error);
        button_toggle_next_or_submit();
    }
}

async function prev_button_action() {
    let participant_id = get_participant_id_from_url();
    let study_id = get_study_id_from_url();
    let curr_page_nr = get_page_nr_from_url();

    if (curr_page_nr == 1) {
        console.log("You are already in the first page!");
        return;
    }

    prev_page_nr = curr_page_nr - 1;
    db_get_and_set_participant_diagnosis_prev_button_click(participant_id, study_id, prev_page_nr);
}

async function radio_button_changed() {
    let ret = get_radio_button_status();
    let curr_page_nr = get_page_nr_from_url();
    const up = get_params_from_url();
    let total_pages = parseInt(up.total_pages, 10);

    if (ret == null) {
        button_next.disabled = true;
        button_submit.disabled = true;
        return;
    }

    if (curr_page_nr == total_pages) {
        button_next.disabled = true;
        button_submit.disabled = false;
    } else {
        button_next.disabled = false;
        button_submit.disabled = true;
    }
}

function set_suggested_diag(value) {
    // suggested_diag1.textContent = value;
    suggested_diag2.textContent = value;

    p_card = document.getElementById("patient-card");

    if (value == "OCDegen") {
        // suggested_diag1.className = "";
        suggested_diag2.className = "";
        // suggested_diag1.className = "unhealthy"
        suggested_diag2.className = "unhealthy"
        p_card.classList.remove('healthy')
        p_card.classList.add('unhealthy')
    } else {
        // suggested_diag1.className = "";
        suggested_diag2.className = "";
        // suggested_diag1.className = "healthy"
        suggested_diag2.className = "healthy"
        p_card.classList.remove('unhealthy')
        p_card.classList.add('healthy')
    }
}

function set_concept_title_color(){
    xai_titles = document.getElementsByClassName("xai-title");
    for (let i = 0; i < xai_titles.length; i++) {
        let el = xai_titles[i];
        console.log("Inner: " + el.innerHTML);
        if (el.innerHTML.includes("OCDegen")) {
            el.classList.add('unhealthy');
            el.classList.remove('healthy');
        } else if (el.innerHTML.includes("Healthy")) {
            el.classList.add('healthy');
            el.classList.remove('unhealthy');
        }
        else {
            el.classList.remove('healthy');
            el.classList.remove('unhealthy');
            console.log("No match");
        }
    }
}

function set_x_ray_location(value) {
    x_ray_location.textContent = value;
}

function set_true_diag(value) {
    true_diag.textContent = value;
    if (value == "OCDegen") {
        true_diag.className = ""
        true_diag.className = "unhealthy"
    } else {
        true_diag.className = ""
        true_diag.className = "healthy"
    }

}

//get total pagecount for the study
function csv_json_get_total_page_count() {
    return input.PATIENT_ID.length;
}

function csv_json_get_main_attributes(page_nr) {

    index = window.shuffledIndices[page_nr-1]; // get the shuffled index for this page number
    l_patient_id = input.PATIENT_ID[index];
    l_x_ray_loc = input.X_RAY_LOCATION[index];
    l_true_diag = input.TRUE_DIAG[index];
    l_suggested_diag = input.SUGGESTED_DIAG[index];
    l_image = "img/" + input.X_RAY_IMAGE[index];
    l_trait = input.X_RAY_TRAIT[index];
    attributes = [l_patient_id, l_image, l_x_ray_loc, l_true_diag, l_suggested_diag, l_trait];
    return attributes;
}

function set_main_attributes_in_html_page(page_nr, attr) {
    //attributes = [patient_id, image, x_ray_loc, true_diag, suggested_diag]
    set_patient_id(attr[0]);
    set_x_ray_image(attr[1]);
    set_x_ray_location(attr[2]);
    set_x_ray_trait(attr[5]);
    set_true_diag(attr[3]);
    set_suggested_diag(attr[4])
    set_progress(page_nr, csv_json_get_total_page_count());
}

function csv_json_get_all_attributes_and_set_in_html_page(page_nr) {
    attr = csv_json_get_main_attributes(page_nr);
    set_main_attributes_in_html_page(page_nr, attr);
    attr = csv_json_get_additional_attributes(page_nr);
    set_additional_attributes_in_html_page(page_nr, attr);
    set_concept_title_color();
}

function csv_json_get_additional_attributes(page_nr) {

    index = window.shuffledIndices[page_nr-1]; // get the shuffled index for this page number
    l_patient_id = input.PATIENT_ID[index];
    // X_RAY_Trait = input.X_RAY_TRAIT[index];

    let concept1_caption_parts = input.Example1_Caption[index].split('<br>');
    let concept2_caption_parts = input.Example2_Caption[index].split('<br>');
    let concept3_caption_parts = input.Example3_Caption[index].split('<br>');
    let concept4_caption_parts = input.Example4_Caption[index].split('<br>');

    // replace & with & <br> to force line break in caption
    concept1_caption_parts[0] = concept1_caption_parts[0].replace(/&/g, '& <br>');
    concept2_caption_parts[0] = concept2_caption_parts[0].replace(/&/g, '& <br>');
    concept3_caption_parts[0] = concept3_caption_parts[0].replace(/&/g, '& <br>');
    concept4_caption_parts[0] = concept4_caption_parts[0].replace(/&/g, '& <br>');

    // remove concept value score from caption if present
    concept1_caption_parts[0] = concept1_caption_parts[0].replace(/: \d\.\d\d/g, "");
    concept2_caption_parts[0] = concept2_caption_parts[0].replace(/: \d\.\d\d/g, "");
    concept3_caption_parts[0] = concept3_caption_parts[0].replace(/: \d\.\d\d/g, "");
    concept4_caption_parts[0] = concept4_caption_parts[0].replace(/: \d\.\d\d/g, "");

    concept_card_1_title = concept1_caption_parts[1];
    concept_card_1_image = "img/" + input.Example1[index];
    concept_card_1_caption = concept1_caption_parts[0];

    concept_card_2_title = concept2_caption_parts[1];
    concept_card_2_image = "img/" + input.Example2[index];
    concept_card_2_caption = concept2_caption_parts[0];

    concept_card_3_title = concept3_caption_parts[1];
    concept_card_3_image = "img/" + input.Example3[index];
    concept_card_3_caption = concept3_caption_parts[0];

    concept_card_4_title = concept4_caption_parts[1];
    concept_card_4_image = "img/" + input.Example4[index];
    concept_card_4_caption = concept4_caption_parts[0];

    attributes = [concept_card_1_title, concept_card_1_image, concept_card_1_caption,
        concept_card_2_title, concept_card_2_image, concept_card_2_caption,
        concept_card_3_title, concept_card_3_image, concept_card_3_caption,
        concept_card_4_title, concept_card_4_image, concept_card_4_caption];

    return attributes;
}

function set_additional_attributes_in_html_page(page_nr, attr) {
    const wrap = txt => {
        return txt
            // Color the True Diagnosis word
            .replace(
                /True Diagnosis:\s*(\w+)/,
                (m, diag) =>
                    `True Diagnosis: <span class="${diag === "OCDegen" ? "unhealthy" : "healthy"
                    }">${diag}</span>`
            )
            // Insert a <br> and color the Suggested Diagnosis word
            .replace(
                /Suggested Diagnosis:\s*(\w+)/,
                (m, diag) =>
                    `<br>Suggested Diagnosis: <span class="${diag === "OCDegen" ? "unhealthy" : "healthy"
                    }">${diag}</span>`
            );
    };

    // Example 1
    document.getElementById("concept-card-1-title").textContent = attr[0];
    document.getElementById("concept-card-1-image").src = attr[1];
    document.getElementById("concept-card-1-caption").innerHTML =
        wrap(attr[2]);

    // Example 2
    document.getElementById("concept-card-2-title").textContent = attr[3];
    document.getElementById("concept-card-2-image").src = attr[4];
    document.getElementById("concept-card-2-caption").innerHTML =
        wrap(attr[5]);

    // Example 3
    document.getElementById("concept-card-3-title").textContent = attr[6];
    document.getElementById("concept-card-3-image").src = attr[7];
    document.getElementById("concept-card-3-caption").innerHTML =
        wrap(attr[8]);

    // Example 4
    document.getElementById("concept-card-4-title").textContent = attr[9];
    document.getElementById("concept-card-4-image").src = attr[10];
    document.getElementById("concept-card-4-caption").innerHTML =
        wrap(attr[11]);
}

async function load_json_data() {
    try {
        const response = await fetch("input.json"); // Fetch JSON asynchronously
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        input = await response.json();  // Set input with the loaded JSON
        console.log('Data loaded:', input);  // Debug: Confirm input data loaded
        init_page();
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        input = null;  // Reset input in case of error
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    await load_json_data();
});

button_next.addEventListener("click", function () {
    next_button_action();
});

button_submit.addEventListener("click", function () {
    next_button_action();
});

button_prev.addEventListener("click", function () {
    prev_button_action();
});


radio_buttons.forEach((radio) => {
    radio.addEventListener("change", function () {
        radio_button_changed();
    });
});


// Keeps the page in-sync when the user clicks the browser Back/Forward buttons
window.addEventListener('popstate', () => {
    const pid = get_participant_id_from_url();
    const sid = get_study_id_from_url();
    if (sessionStorage.getItem(`study_done_${pid}_${sid}`) === 'true') {
        window.location.replace(`/feedback/index.html?participant_id=${pid}&study_id=${sid}`);
        return;               // nothing else in the handler runs
    }

    const page_nr = get_page_nr_from_url();

    // Refresh the main content for the new page number
    csv_json_get_all_attributes_and_set_in_html_page(page_nr);

    // Re-load any diagnosis already stored for that page
    db_get_and_set_participant_diagnosis(
        get_participant_id_from_url(),
        get_study_id_from_url(),
        page_nr
    );

    // Update the Next/Submit button label
    button_toggle_next_or_submit();
});