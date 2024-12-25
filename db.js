const mongoose = require('mongoose')
require('dotenv').config();

//Define the mongodb connection url:
const mongoURL = process.env.MONGODB_URL_LOCAL;

// Set up mongodb connection:
mongoose.connect(mongoURL)

// Get the default connection:
// Mongoose maintains a default connection object representing the MongoDB connection:
const db = mongoose.connection;

// Define event listeners for databse connnection:
db.on('connected', () => {
    console.log('Connected to MongoDB server')
});

db.on('error', (err) => {
    console.error('MongoDB connection error:', err)
});

db.on('desconnected', () => {
    console.log('MongoDB disconnected')
});

// Export the database connection: 
module.exports = db;
