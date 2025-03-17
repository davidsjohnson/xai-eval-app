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
        page_nr INTEGER NOT NULL
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

/*
function cb_event_write_db(req, res) 
{
    const { participant_id,study_id,xray_image,participant_diagnosis, page_nr} = req.body;
    console.log(`Saving to database: participant_id=${participant_id}, study_id=${study_id}, xray_image=${xray_image}, participant_diagnosis=${participant_diagnosis}, page_nr=${page_nr}`);
    
    let p_diagnosis = (participant_diagnosis === "healthy") ? "Healthy" : "OCDegen";

    db.run(`INSERT INTO participant_feedback (participant_id, study_id, xray_image, participant_diagnosis, page_nr) VALUES (?, ?, ?, ?, ?)`, [participant_id, study_id, xray_image, p_diagnosis, page_nr], (err) => {
        if (err) {
            return res.status(500).send('Error saving data');
        }
        res.json({ message: "Data stored successfully!" });
    });
}
*/

/* 1. Checks if an entry exists with the same participant_id, study_id, and page_nr
 * 2. If an entry exists  -> Updates participant_diagnosis and xray_image
 * 3. If no entry         -> Inserts a new record into the database
 */
function cb_event_write_db(req, res) {
    const { participant_id, study_id, xray_image, participant_diagnosis, page_nr } = req.body;

    console.log(`Checking database for existing entry: participant_id=${participant_id}, study_id=${study_id}, page_nr=${page_nr}`);

    let p_diagnosis = (participant_diagnosis === "healthy") ? "Healthy" : "OCDegen";

    // First, check if an entry already exists
    db.get(
        `SELECT * FROM participant_feedback WHERE study_id = ? AND participant_id = ? AND page_nr = ?`,
        [study_id, participant_id, page_nr],
        (err, row) => {
            if (err) {
                return res.status(500).send('Database error');
            }

            if (row) {
                // If entry exists, update it
                db.run(
                    `UPDATE participant_feedback 
                     SET participant_diagnosis = ?, xray_image = ? 
                     WHERE study_id = ? AND participant_id = ? AND page_nr = ?`,
                    [p_diagnosis, xray_image, study_id, participant_id, page_nr],
                    (updateErr) => {
                        if (updateErr) {
                            return res.status(500).send('Error updating data');
                        }
                        res.json({ message: "Data updated successfully!" });
                    }
                );
            } else {
                // If no existing entry, insert a new one
                db.run(
                    `INSERT INTO participant_feedback (participant_id, study_id, xray_image, participant_diagnosis, page_nr)
                     VALUES (?, ?, ?, ?, ?)`,
                    [participant_id, study_id, xray_image, p_diagnosis, page_nr],
                    (insertErr) => {
                        if (insertErr) {
                            return res.status(500).send('Error saving data');
                        }
                        res.json({ message: "Data stored successfully!" });
                    }
                );
            }
        }
    );
}


function cb_event_read_db(req, res) {
    db.all("SELECT * FROM participant_feedback", [], (err, rows) => {
        if (err) {
            console.error("Database Error:", err);
            res.status(500).json({ error: "Error reading data" }); 
            return;
        }
        res.json(rows); 
    });
}

function cb_event_read_db_prev(req, res) {
    const { participant_id, study_id, page_nr } = req.query;

    console.log(`Checking database for existing entry: participant_id=${participant_id}, study_id=${study_id}, page_nr=${page_nr}`);
    const query = `SELECT * FROM participant_feedback WHERE participant_id = ? AND study_id = ? AND page_nr = ?`;

    const params = [participant_id, study_id, page_nr];

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error("Database Error:", err);
            res.status(500).json({ error: "Error reading data" });
            return;
        }
        console.error(rows);
        res.json(rows);
    });
}


function cb_event_participant_id(req, res)
{
    const { participant_id, study_id } = req.body; // Get both participant_id and study_id from the request body
    console.log(`[ CLIENT REQUEST ] Submit Participant ID: ${encodeURIComponent(participant_id)}`);
    console.log(`[ CLIENT REQUEST ] Submit Study ID: ${encodeURIComponent(study_id)}`);

    if (participant_id && study_id) {
        //just return to client
        res.json({participant_id, study_id});
    } else {
        res.status(400).send('Participant ID and Study ID are required');
    }

}

function cb_event_get_max_page_nr(req, res) {
    const { participant_id, study_id } = req.query;

    console.log(`Fetching max page_nr for: participant_id=${participant_id}, study_id=${study_id}`);

    const query = `SELECT MAX(page_nr) AS max_page FROM participant_feedback WHERE participant_id = ? AND study_id = ?`;

    db.get(query, [participant_id, study_id], (err, row) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Error retrieving max page number" });
        }
        res.json({ max_page_nr: row?.max_page ?? 1 }); // Return max page or 1 if no records [ the study page starts with page 1]
    });
}

init();
register_post_event("/write_db", cb_event_write_db);
register_post_event("/post_participant_id", cb_event_participant_id);
register_get_event("/read_db", cb_event_read_db);
register_get_event("/read_db_prev", cb_event_read_db_prev);
register_get_event("/read_db_get_max_page_nr", cb_event_get_max_page_nr);
start_http_server(PORT);
