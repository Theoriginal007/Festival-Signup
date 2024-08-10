const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const mysql = require('mysql');
const bodyParser = require('body-parser');
require('dotenv').config(); // Load environment variables from .env file

// Load environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yourDatabaseName';
const PORT = process.env.PORT || 3000;

// MySQL configuration
const mysqlConfig = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
};

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(bodyParser.json()); // Parse JSON bodies for MySQL routes

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect(MONGODB_URI, {
    // Deprecated options removed
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

// Create a connection to the MySQL database
const mysqlConnection = mysql.createConnection(mysqlConfig);

// Connect to the MySQL database
mysqlConnection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');

    // Optionally, you might want to close the connection later
    // mysqlConnection.end();
});

// Define MongoDB schemas and models
const artistSchema = new mongoose.Schema({
    name: String,
    time: String,
});

const Artist = mongoose.model('Artist', artistSchema);

const ticketSchema = new mongoose.Schema({
    fullName: String,
    emailAddress: String,
    phoneNumber: String,
    ticketType: String,
    subscribeToNewsletter: Boolean,
});

const Ticket = mongoose.model('Ticket', ticketSchema);

// Routes for serving static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/lineup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'lineup.html'));
});

app.get('/tickets', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'tickets.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// API routes for MongoDB artists
app.get('/api/artists', async (req, res) => {
    try {
        const artists = await Artist.find();
        res.json(artists);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve artists', error: error.message });
    }
});

app.post('/api/artists', async (req, res) => {
    const { name, time } = req.body;

    // Validation
    if (!name || !time) {
        return res.status(400).json({ message: 'Name and time are required' });
    }

    const artist = new Artist({ name, time });

    try {
        const newArtist = await artist.save();
        res.status(201).json(newArtist);
    } catch (error) {
        console.error('Error adding artist:', error); // Log error details
        res.status(400).json({ message: 'Failed to create artist', error: error.message });
    }
});

app.put('/api/artists/:id', async (req, res) => {
    try {
        const artist = await Artist.findById(req.params.id);
        if (!artist) return res.status(404).json({ message: 'Artist not found' });

        artist.name = req.body.name || artist.name;
        artist.time = req.body.time || artist.time;

        const updatedArtist = await artist.save();
        res.json(updatedArtist);
    } catch (error) {
        res.status(400).json({ message: 'Failed to update artist', error: error.message });
    }
});

app.delete('/api/artists/:id', async (req, res) => {
    try {
        const artist = await Artist.findByIdAndDelete(req.params.id);
        if (!artist) return res.status(404).json({ message: 'Artist not found' });

        res.json({ message: 'Artist deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete artist', error: error.message });
    }
});

// API routes for MySQL tickets
app.post('/submit-form', (req, res) => {
    const { name, email, phone, ticketType, newsletter } = req.body;

    const query = 'INSERT INTO signups (name, email, phone, ticketType, newsletter) VALUES (?, ?, ?, ?, ?)';
    const values = [name, email, phone, ticketType, newsletter];

    mysqlConnection.query(query, values, (error, results) => {
        if (error) {
            console.error('Error:', error);
            res.status(500).send('Server Error');
            return;
        }
        res.json({ success: true });
    });
});

// 404 Not Found
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
