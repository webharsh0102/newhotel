const express = require('express');
const cors = require('cors');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const app = express();
app.use(cors());

// SerialPort connection to read data from NodeMCU via USB (COM12 in this example)
const port = new SerialPort({
    path: 'COM12',  // Adjust to your actual port
    baudRate: 9600
});
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

let signalStrength = 0;

// Read signal strength from NodeMCU
parser.on('data', (data) => {
    signalStrength = parseInt(data.toString().trim());
    console.log('Signal Strength:', signalStrength);
});

// Endpoint to send signal strength to the browser
app.get('/get-signal-strength', (req, res) => {
    res.json({ signalStrength });
});

// Start a local server on the client machine (port 4000)
app.listen(4000, () => {
    console.log('Client-side Node.js app running on port 4000');
});
