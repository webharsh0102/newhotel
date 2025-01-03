const express = require('express'); // Import Express
const bodyParser = require('body-parser'); // Middleware for parsing JSON
const mongoose = require('mongoose'); // Mongoose for MongoDB

const menurouter = require('./adding/router.js'); // Router for menu
const personModel = require('./adding/personModel.js'); // Model for persons

const app = express(); // Create an Express app
app.use(bodyParser.json()); // Parse incoming JSON

// MongoDB connection
const url = "mongodb://127.0.0.1:27017/database"; // Local MongoDB connection string
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB successfully."))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Routes
app.use('/menu', menurouter); // Use menu routes

// POST data
app.post('/data', async (req, res) => {
  try {
    const newPerson = new personModel(req.body); // Create a new instance of the person model
    await newPerson.save(); // Save to DB
    res.status(200).send("Data saved successfully");
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Error saving data");
  }
});

// GET all data
app.get('/getdata', async (req, res) => {
  try {
    const data = await personModel.find(); // Fetch all records
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching data");
  }
});

// GET data by variable (e.g., age)
app.get('/getdata/:variable', async (req, res) => {
  try {
    const vari = req.params.variable;
    const data = await personModel.find({ age: vari }); // Query by age
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching data");
  }
});

// Start the server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
