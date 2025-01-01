const express = require('express');
const app = express();
const port = 3000;

let signalStrength = '';  // To store the signal strength data received from NodeMCU

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Endpoint to receive data from NodeMCU
app.post('/receiveData', (req, res) => {
  signalStrength = req.body.data;  // Store the signal strength
  console.log("Signal Strength received: " + signalStrength);
  res.send('Data received');
});

// Serve the HTML page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Signal Strength</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          background-color: #f4f4f4;
        }
        h1 {
          color: #333;
        }
      </style>
    </head>
    <body>
      <h1>Wi-Fi Signal Strength: <span id="signalStrength"></span> dBm</h1>
      <script>
        document.addEventListener("DOMContentLoaded", () => {
          setInterval(async () => {
            try {
              const response = await fetch('/getSignalStrength');
              const data = await response.json();
              
              // Update the signal strength value in the HTML
              document.getElementById('signalStrength').innerText = data.signalStrength;
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          }, 5000);  // Refresh every 5 seconds
        });
      </script>
    </body>
    </html>
  `);
});

// API endpoint to serve the signal strength
app.get('/getSignalStrength', (req, res) => {
  res.json({ signalStrength });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
