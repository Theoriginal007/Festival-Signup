const mysql = require('mysql');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

// Load environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yourDatabaseName';
const MYSQL_HOST = process.env.MYSQL_HOST || 'localhost';
const MYSQL_USER = process.env.MYSQL_USER || 'root';
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || 'yourpassword';
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || 'music_festival';

// MySQL connection setup
const mysqlConnection = mysql.createConnection({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE
});

mysqlConnection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL');
    }
    mysqlConnection.end(); // Close the connection
});

// MongoDB connection setup
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('Failed to connect to MongoDB', err);
});
