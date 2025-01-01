const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const { SerialPort } = require('serialport'); // For version 10 and above
const { ReadlineParser } = require('@serialport/parser-readline'); // Correct import for the parser

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'new_password',
    database: 'attendance_system'
});

// Connect to MySQL
db.connect((err) => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

// Serial port setup for NodeMCU
const port = new SerialPort({ 
    path: 'COM12',  // Adjust COM port
    baudRate: 9600 
});

let signalStrength = 0;

// Read signal strength from NodeMCU
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' })); // Use ReadlineParser
parser.on('data', function(data) {
    signalStrength = parseInt(data.toString());
    console.log('Signal Strength:', signalStrength);
});

// Route to handle login and signal strength check
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Validate username and password
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
            // Check if signal strength is above threshold
            const threshold = -50;  // Example threshold for signal strength
            if (signalStrength > threshold) {
                res.json({ status: 'success', message: 'Proceed to fingerprint verification' });
            } else {
                res.json({ status: 'fail', message: 'Weak signal. Cannot proceed.' });
            }
        } else {
            res.json({ status: 'fail', message: 'Invalid login credentials' });
        }
    });
});

// Fingerprint verification route
app.post('/verify-fingerprint', (req, res) => {
    const { username, fingerprintData } = req.body;

    const query = 'SELECT fingerprint_data, roll_no FROM users WHERE username = ?';
    db.query(query, [username], (err, result) => {
        if (err) throw err;

        if (result.length > 0 && result[0].fingerprint_data === fingerprintData) {
            // Mark attendance if fingerprint matches
            const query = 'INSERT INTO attendance (roll_no, date, status) VALUES (?, CURDATE(), "Present")';
            db.query(query, [result[0].roll_no], (err, result) => {
                if (err) throw err;
                res.json({ status: 'success', message: 'Attendance marked' });
            });
        } else {
            res.json({ status: 'fail', message: 'Fingerprint mismatch' });
        }
    });
});

// Start server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});
