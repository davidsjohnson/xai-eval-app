const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const project_root = "../";
const app = express();
const db_path = path.join(__dirname, project_root, 'database/database.db');
const PORT = 7000;
const client_ui_web_pages_location='client/ui';
let db;

// Initialize the server and database
function init() {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, project_root, client_ui_web_pages_location)));
    db_init();
}

function start_http_server(port) {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}?participant_id=123&study_id=456`);
    });
}

function db_create_or_open()
{
    // Create or open the database
    db = new sqlite3.Database(db_path, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Database opened (or created if not existing) successfully.');
    }

    });

    //Other files can access it
    module.exports = db;
}

function db_table_init()
{
    // Create table if it doesn't exist
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS participant_feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        participant_id TEXT NOT NULL,
        study_id INTEGER NOT NULL,
        xray_image TEXT NOT NULL,
        participant_diagnosis TEXT NOT NULL,
        page_index INTEGER NOT NULL
    )`);
    });
}

function db_init()
{
    db_create_or_open();
    db_table_init();
}

// Register a POST route
function register_post_event(route, callback) {
    app.post(route, (req, res) => {
        callback(req, res);
    });
}

// Register a GET route
function register_get_event(route, callback) {
    app.get(route, (req, res) => {
        callback(req, res);
    });
}

function cb_even_write_db(req, res) 
{
    const { participant_id,study_id,xray_image,participant_diagnosis, page_index} = req.body;
    console.log(`Saving to database: participant_id=${participant_id}, study_id=${study_id}, xray_image=${xray_image}, participant_diagnosis=${participant_diagnosis}`);
    
    let p_diagnosis = (participant_diagnosis === "healthy") ? "Healthy" : "OCDegen";

    db.run(`INSERT INTO participant_feedback (participant_id, study_id, xray_image, participant_diagnosis, page_index) VALUES (?, ?, ?, ?, ?)`, [participant_id, study_id, xray_image, p_diagnosis, page_index], (err) => {
        if (err) {
            return res.status(500).send('Error saving data');
        }
        res.json({ message: "Data stored successfully!" });
    });
}

function cb_even_read_db(req, res) {
    db.all("SELECT * FROM participant_feedback", [], (err, rows) => {
        if (err) {
            console.error("Database Error:", err);
            res.status(500).json({ error: "Error reading data" }); 
            return;
        }
        res.json(rows); 
    });
}

function cb_even_read_db_prev(req, res) {
    const { participant_id, study_id, page_index } = req.query;

    const query = `
        SELECT * FROM participant_feedback
        WHERE participant_id = ? AND study_id = ? AND page_index = ?`;

    const params = [participant_id, study_id, page_index];

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error("Database Error:", err);
            res.status(500).json({ error: "Error reading data" });
            return;
        }
        res.json(rows);
    });
}


function cb_even_participant_id(req, res)
{
    const { participant_id, study_id } = req.body; // Get both participant_id and study_id from the request body
    console.log(`[ CLIENT REQUEST ] Submit Participant ID: ${encodeURIComponent(participant_id)}`);
    console.log(`[ CLIENT REQUEST ] Submit Study ID: ${encodeURIComponent(study_id)}`);

    if (participant_id && study_id) {
        res.json({
            participant_id,    // Return participant_id
            study_id,          // Return study_id
            redirect: `/page.study/index.html?participant_id=${encodeURIComponent(participant_id)}&study_id=${encodeURIComponent(study_id)}`
        });
    } else {
        res.status(400).send('Participant ID and Study ID are required');
    }

}

init();
register_post_event("/write_db", cb_even_write_db);
register_post_event("/post_participant_id", cb_even_participant_id);
register_get_event("/read_db", cb_even_read_db);
register_get_event("/read_db_prev", cb_even_read_db_prev);
start_http_server(PORT);
