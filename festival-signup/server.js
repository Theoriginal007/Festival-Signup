const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
console.log('MongoDB URI:', process.env.MONGODB_URI);
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3000; // Default port is 3000

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB', err);
    });


// Define a schema and model for artists
const artistSchema = new mongoose.Schema({
    name: String,
    time: String,
});

const Artist = mongoose.model('Artist', artistSchema);

// Route: Home
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route: Lineup
app.get('/lineup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'lineup.html'));
});

// Route: Tickets
app.get('/tickets', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'tickets.html'));
});

// Route: Contact
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// API route: Get all artists
app.get('/api/artists', async (req, res) => {
    try {
        const artists = await Artist.find();
        res.json(artists);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// API route: Add a new artist
app.post('/api/artists', async (req, res) => {
    const artist = new Artist({
        name: req.body.name,
        time: req.body.time,
    });

    try {
        const newArtist = await artist.save();
        res.status(201).json(newArtist);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// API route: Update an artist
app.put('/api/artists/:id', async (req, res) => {
    try {
        const artist = await Artist.findById(req.params.id);
        if (!artist) return res.status(404).json({ message: 'Artist not found' });

        artist.name = req.body.name || artist.name;
        artist.time = req.body.time || artist.time;

        const updatedArtist = await artist.save();
        res.json(updatedArtist);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// API route: Delete an artist
app.delete('/api/artists/:id', async (req, res) => {
    try {
        const artist = await Artist.findByIdAndDelete(req.params.id);
        if (!artist) return res.status(404).json({ message: 'Artist not found' });

        res.json({ message: 'Artist deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route: 404 Not Found
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
