const express = require('express')
const app = express();
const db = require('./db');
require('dotenv').config();

const bodyParser = require('body-parser');
app.use(bodyParser.json()) // req.body
const PORT = process.env.PORT

// Import the router files:
const userRoutes = require('./Routes/userRoutes')

// Use the routers:
app.use('/user', userRoutes)

app.listen(PORT, () => {
    console.log('Listening on port 3000')
})