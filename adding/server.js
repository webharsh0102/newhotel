const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

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

// API for marking attendance
app.post('/mark-attendance', (req, res) => {
    const { roll_no, signalStrength } = req.body;

    // Find the student in the database
    db.query('SELECT * FROM students WHERE roll_no = ?', [roll_no], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            const student_id = results[0].id;

            // Check if signal strength is above the limit
            if (signalStrength > -80) {
                const status = 'present';

                // Insert attendance record
                const attendanceQuery = 'INSERT INTO attendance (roll_no, status) VALUES (?, ?)';
                db.query(attendanceQuery, [ roll_no, status ], (err, result) => {
                    if (err) throw err;
                    res.json({ message: 'Attendance marked as present', status: 'success' });
                });
            } else {
                res.json({ message: 'Signal strength too low', status: 'fail' });
            }
        } else {
            res.json({ message: 'Student not found', status: 'fail' });
        }
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
// sdksla
