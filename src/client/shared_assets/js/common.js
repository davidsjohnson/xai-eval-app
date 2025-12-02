//  Utility functions for consistent randomization based on participant ID
function hashStringToSeed(str) {
    // A simple hash function to convert a string to a numeric seed for randomization of data samples
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
        h = (h << 13) | (h >>> 19);
    }
    return (h >>> 0); // force unsigned 32-bit
}

function mulberry32(seed) {
    return function () {
        seed |= 0;
        seed = (seed + 0x6D2B79F5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function shuffle(array, rng) {
    const a = array.slice(); // copy
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// page setup functions
function get_page_nr_from_url() {
    const url_params = get_params_from_url();
    if (url_params.page_nr == null) {
        return 1; //if page_nr is null in the url it should be the first page ( or page refresh happened without url encoding details )
    }

    return parseInt(url_params.page_nr);
}

function get_study_id_from_url() {
    const url_params = get_params_from_url();
    return url_params.study_id;
}

function get_participant_id_from_url() {
    const url_params = get_params_from_url();
    return url_params.participant_id;
}

function get_params_from_url() {
    const params = new URLSearchParams(window.location.search);

    return {
        participant_id: params.get('participant_id') ? decodeURIComponent(params.get('participant_id')) : null,
        study_id: params.get('study_id') ? decodeURIComponent(params.get('study_id')) : null,
        study_type: params.get('study_id') ? decodeURIComponent(params.get('study_type')) : null,
        page_nr: params.get('page_nr') ? decodeURIComponent(params.get('page_nr')) : null,
        total_pages: params.get('page_nr') ? decodeURIComponent(params.get('total_pages')) : null,
    };
}

async function init_page() {
    if (input == null) {
        console.log('Input is null, returning.');
        return;
    }

    const up = get_params_from_url();
    let n_correct;
    let start_indices;
    if (up.total_pages === '30') {
        n_correct = 6
        start_indices = [0, 1, 2, 3, 4, 5];
    } else {
        n_correct = 4   
        start_indices = [0, 1, 2, 3];
    }

    console.log('App is running!');
    let participant_id = get_participant_id_from_url();
    let study_id = get_study_id_from_url();
    let page_nr = get_page_nr_from_url();

    // randomize study indices for counterbalancing
    const totalPages = Math.max(0, parseInt(up.total_pages, 10) || 0);
    const indices = Array.from({ length: totalPages - n_correct }, (_, idx) => idx + n_correct);

    // 2) Seed from participant ID
    const seed = hashStringToSeed(participant_id);
    const rand = mulberry32(seed);

    // 3) Shuffle deterministically
    let shuffledIndicesStart = [];
    let shuffledIndices = [];
    if (up.study_id === 10) {
        // no need to shuffle for tutorial phase
        shuffledIndicesStart = start_indices;
        shuffledIndices = indices;
    } else {
        shuffledIndicesStart = shuffle(start_indices, rand);
        shuffledIndices = shuffle(indices, rand);
    }
    console.log(shuffledIndices);

    // concatenate the two arrays
    window.shuffledIndices = [...shuffledIndicesStart, ...shuffledIndices];
    console.log('Final shuffled indices:', window.shuffledIndices);

    db_get_and_set_participant_diagnosis(participant_id, study_id, page_nr);
    csv_json_get_all_attributes_and_set_in_html_page(page_nr);
    log_page_visit(participant_id, study_id, page_nr);
}